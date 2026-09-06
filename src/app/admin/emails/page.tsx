'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { emailStore, EmailMessage } from '@/lib/stores/EmailStore';
import { useToast } from '@/components/ToastProvider';
import { 
  HiMail, 
  HiMailOpen, 
  HiInbox, 
  HiPaperAirplane, 
  HiTrash, 
  HiRefresh, 
  HiReply, 
  HiSearch, 
  HiPlus, 
  HiCheckCircle, 
  HiExclamation, 
  HiX,
  HiClock,
  HiArrowLeft
} from 'react-icons/hi';

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailMessage[]>(() => emailStore.emails);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(() => emailStore.selectedEmail);
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'trash'>('inbox');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(() => !emailStore.isInitialized && emailStore.emails.length === 0);
  const [isSyncing, setIsSyncing] = useState(() => emailStore.isSyncing);
  const [syncStatus, setSyncStatus] = useState(() => emailStore.syncStatus);
  const [syncMessage, setSyncMessage] = useState(() => emailStore.syncMessage);
  const [unreadCount, setUnreadCount] = useState(() => emailStore.unreadCount);

  // Reply Composer State
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const replyRef = useRef<HTMLDivElement>(null);

  // Compose Modal State
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sendingCompose, setSendingCompose] = useState(false);

  // Mobile View state (toggle between list and message detail)
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const { showToast, showConfirm } = useToast();

  useEffect(() => {
    // Subscribe to EmailStore updates
    const unsubscribe = emailStore.subscribe(() => {
      setEmails([...emailStore.emails]);
      setSelectedEmail(emailStore.selectedEmail);
      setIsLoading(emailStore.isLoading && emailStore.emails.length === 0);
      setIsSyncing(emailStore.isSyncing);
      setSyncStatus(emailStore.syncStatus);
      setSyncMessage(emailStore.syncMessage);
      setUnreadCount(emailStore.unreadCount);
    });

    // Load initial emails for folder
    emailStore.getEmails(folder);

    return unsubscribe;
  }, [folder]);

  // Handle folder switch
  const handleSelectFolder = (newFolder: 'inbox' | 'sent' | 'trash') => {
    setFolder(newFolder);
    emailStore.selectEmail(null);
    setMobileShowDetail(false);
    emailStore.getEmails(newFolder, 1, true);
  };

  // Trigger manual sync with webmail
  const handleSync = async () => {
    showToast('Connecting to webmail to fetch incoming emails...', 'info');
    const result = await emailStore.syncIncomingEmails(false);
    if (result.success) {
      showToast(result.message || 'Inbox updated with latest emails!', 'success');
    } else {
      if (emailStore.syncStatus === 'unconfigured') {
        showToast('Please enter your webmail password in api/.env to connect', 'warning');
      } else {
        showToast(result.message || 'Unable to sync with webmail server', 'warning');
      }
    }
  };

  // Filtered emails based on search query
  const filteredEmails = useMemo(() => {
    if (!search.trim()) return emails;
    const q = search.toLowerCase();
    return emails.filter(e => 
      (e.subject || '').toLowerCase().includes(q) ||
      (e.from || '').toLowerCase().includes(q) ||
      (e.fromName || '').toLowerCase().includes(q) ||
      (e.bodyText || '').toLowerCase().includes(q)
    );
  }, [emails, search]);

  // Handle email row click
  const handleSelectEmail = (email: EmailMessage) => {
    emailStore.selectEmail(email);
    setMobileShowDetail(true);
    // Reset reply body when opening another email
    setReplyBody('');
  };

  // Format date display
  const formatEmailDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Format full timestamp for detail view
  const formatFullDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Submit Inline Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail) return;
    if (!replyBody.trim()) {
      showToast('Please enter your reply message', 'warning');
      return;
    }

    setSendingReply(true);
    try {
      const recipient = selectedEmail.from;
      const res = await emailStore.sendReply({
        to: recipient,
        subject: selectedEmail.subject,
        body: replyBody,
        emailId: selectedEmail._id,
        inReplyTo: selectedEmail.messageId,
      });

      if (res.success) {
        showToast('Reply sent successfully to ' + recipient + '!', 'success');
        setReplyBody('');
      } else {
        showToast(res.message || 'Failed to send reply', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error sending reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  // Submit Brand New Compose Email
  const handleSendCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeBody.trim()) {
      showToast('Recipient email and body are required', 'warning');
      return;
    }

    setSendingCompose(true);
    try {
      const res = await emailStore.sendNewEmail({
        to: composeTo.trim(),
        subject: composeSubject.trim() || '(No Subject)',
        body: composeBody,
      });

      if (res.success) {
        showToast('Email sent successfully!', 'success');
        setShowComposeModal(false);
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
      } else {
        showToast(res.message || 'Failed to send email', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error sending email', 'error');
    } finally {
      setSendingCompose(false);
    }
  };

  // Delete email with confirmation
  const handleDeleteSelected = (email: EmailMessage) => {
    showConfirm({
      title: folder === 'trash' ? 'Permanently Delete Email' : 'Move Email to Trash',
      message: folder === 'trash'
        ? 'Are you sure you want to permanently delete this email? This cannot be undone.'
        : 'Move this email to trash?',
      variant: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        await emailStore.deleteEmail(email._id);
        showToast('Email deleted successfully', 'success');
        setMobileShowDetail(false);
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Webmail Inbox</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-black rounded-full shadow-sm animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium font-inter mt-1">
            Incoming webmail messages from your domain. Read, manage, and reply in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Fetch latest incoming emails from webmail"
          >
            <HiRefresh className={`text-lg text-primary ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Mail'}</span>
          </button>

          {/* Compose Button */}
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <HiPlus className="text-lg" />
            <span>Compose</span>
          </button>
        </div>
      </div>

      {/* Connection Notice Banner if credentials needed */}
      {syncStatus === 'unconfigured' && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
            <HiExclamation />
          </div>
          <div className="flex-1 text-sm text-amber-900">
            <h4 className="font-bold">Webmail Password Setup Required</h4>
            <p className="text-amber-800/90 mt-0.5 leading-relaxed">
              Your server host is set to <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">mail.privateemail.com</code>. 
              Please enter your webmail password in <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">api/.env</code> as <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">SMTP_PASS</code> and <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">IMAP_PASS</code> to begin receiving and sending emails.
            </p>
          </div>
        </div>
      )}

      {syncStatus === 'connected' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-800 font-semibold">
          <div className="flex items-center gap-2">
            <HiCheckCircle className="text-emerald-600 text-base" />
            <span>Connected to Webmail (support@kennytechstudios.com)</span>
          </div>
          <span className="text-emerald-600 text-[11px] font-bold">IMAP Active</span>
        </div>
      )}

      {/* Search & Folder Filter Bar */}
      <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Folder Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => handleSelectFolder('inbox')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              folder === 'inbox' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HiInbox className="text-base" />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                folder === 'inbox' ? 'bg-white text-primary' : 'bg-primary/10 text-primary'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelectFolder('sent')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              folder === 'sent' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HiPaperAirplane className="text-base" />
            <span>Sent</span>
          </button>

          <button
            onClick={() => handleSelectFolder('trash')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              folder === 'trash' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HiTrash className="text-base" />
            <span>Trash</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search emails by sender or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary transition-all font-medium text-slate-800"
          />
          <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <HiX className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Split Window */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[620px] flex">
        {/* Left Column: Email List */}
        <div className={`w-full lg:w-[380px] xl:w-[420px] border-r border-slate-100 flex flex-col ${
          mobileShowDetail ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* List Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              {folder.toUpperCase()} ({filteredEmails.length})
            </span>
            {isSyncing && (
              <span className="text-[11px] font-semibold text-primary flex items-center gap-1.5 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                Updating...
              </span>
            )}
          </div>

          {/* Email Item Rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
            {filteredEmails.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                  <HiInbox />
                </div>
                <p className="font-bold text-slate-700 text-sm">No emails found</p>
                <p className="text-xs text-slate-400">
                  {search ? 'Try clearing your search query' : 'Your ' + folder + ' is currently empty.'}
                </p>
                {folder === 'inbox' && (
                  <button
                    onClick={handleSync}
                    className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Sync with server now
                  </button>
                )}
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?._id === email._id;
                const isUnread = !email.isRead && folder === 'inbox';

                return (
                  <div
                    key={email._id}
                    onClick={() => handleSelectEmail(email)}
                    className={`p-5 transition-all cursor-pointer relative group ${
                      isSelected 
                        ? 'bg-primary/[0.04] border-l-4 border-primary' 
                        : isUnread 
                          ? 'bg-slate-50/70 hover:bg-slate-50' 
                          : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        {isUnread && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse"></div>
                        )}
                        <span className={`text-xs truncate ${isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                          {folder === 'sent' 
                            ? `To: ${email.to?.join(', ') || 'Customer'}` 
                            : email.fromName || email.from}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 flex-shrink-0">
                        {formatEmailDate(email.date)}
                      </span>
                    </div>

                    <h4 className={`text-xs mb-1 line-clamp-1 ${isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                      {email.subject || '(No Subject)'}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {email.bodyText || email.bodyHtml?.replace(/<[^>]*>?/gm, ' ') || 'No content preview'}
                    </p>

                    {/* Quick hover action */}
                    <div className="absolute right-4 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          emailStore.toggleRead(email._id);
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:border-primary text-xs shadow-sm cursor-pointer"
                        title={email.isRead ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {email.isRead ? <HiMail className="text-xs" /> : <HiMailOpen className="text-xs" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSelected(email);
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-red-500 hover:border-red-300 text-xs shadow-sm cursor-pointer"
                        title="Delete"
                      >
                        <HiTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Reading Pane & Reply Composer */}
        <div className={`flex-1 flex flex-col min-w-0 ${
          mobileShowDetail ? 'flex' : 'hidden lg:flex'
        }`}>
          {selectedEmail ? (
            <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
              {/* Mobile back button */}
              <div className="lg:hidden flex items-center gap-2 pb-3 border-b border-slate-100">
                <button
                  onClick={() => setMobileShowDetail(false)}
                  className="flex items-center gap-1 text-xs font-bold text-primary p-1 cursor-pointer"
                >
                  <HiArrowLeft />
                  <span>Back to inbox</span>
                </button>
              </div>

              {/* Message Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
                <div className="min-w-0 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight break-words">
                    {selectedEmail.subject || '(No Subject)'}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                      {(selectedEmail.fromName || selectedEmail.from).substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-tight">
                        {selectedEmail.fromName || selectedEmail.from}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        From: <span className="text-slate-600">{selectedEmail.from}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        To: <span className="text-slate-600">{selectedEmail.to?.join(', ') || 'support@kennytechstudios.com'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <HiClock />
                    {formatFullDate(selectedEmail.date)}
                  </span>
                  <button
                    onClick={() => {
                      replyRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 px-3 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <HiReply className="text-sm" />
                    <span>Reply</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSelected(selectedEmail)}
                    className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Delete Message"
                  >
                    <HiTrash className="text-base" />
                  </button>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="bg-slate-50/50 rounded-3xl p-6 md:p-8 border border-slate-100 min-h-[220px]">
                {selectedEmail.bodyHtml ? (
                  <div
                    className="prose prose-sm max-w-none text-slate-700 leading-relaxed break-words overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                  />
                ) : (
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-sans text-sm">
                    {selectedEmail.bodyText || '(No content)'}
                  </p>
                )}
              </div>

              {/* Inline Reply Box */}
              <div ref={replyRef} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <HiReply className="text-primary text-lg" />
                    <span>Reply to {selectedEmail.fromName || selectedEmail.from}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    To: {selectedEmail.from}
                  </span>
                </div>

                <form onSubmit={handleSendReply} className="space-y-4">
                  <div className="relative">
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your response here..."
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all font-sans text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                      Sending from <strong>support@kennytechstudios.com</strong> via webmail SMTP.
                    </p>
                    <button
                      type="submit"
                      disabled={sendingReply || !replyBody.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-xs transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingReply ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Reply...</span>
                        </>
                      ) : (
                        <>
                          <HiPaperAirplane className="rotate-90 text-sm" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-4">
              <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center text-4xl shadow-sm">
                <HiMail />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-700">Select an email to read</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Choose a conversation from the left pane to view its full details and send an instant reply.
                </p>
              </div>
              <button
                onClick={handleSync}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
              >
                <HiRefresh className="text-sm text-primary" />
                <span>Sync Webmail</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compose New Email Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                  <HiPaperAirplane className="rotate-90" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Compose New Email</h3>
                  <p className="text-xs text-slate-400 font-medium">Send directly from your webmail account</p>
                </div>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">To (Recipient Email) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@example.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Subject</label>
                <input
                  type="text"
                  placeholder="Enter email subject..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Message Content *</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write your email message here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all font-sans text-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-5 py-3 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Discard
                </button>

                <button
                  type="submit"
                  disabled={sendingCompose || !composeTo.trim() || !composeBody.trim()}
                  className="flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-xs transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingCompose ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="rotate-90 text-sm" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
