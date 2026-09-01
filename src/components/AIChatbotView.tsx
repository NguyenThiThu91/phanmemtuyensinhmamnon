import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  HelpCircle, 
  MessageSquare, 
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Heart
} from 'lucide-react';
import type { AIChatMessage } from '../types';
import { SCHOOL_INFO } from '../data/schoolInfo';

const QUICK_SUGGESTIONS = [
  '👶 Bé sinh năm 2023 năm nay vào khối lớp nào?',
  '📱 Hướng dẫn cách chụp thông tin cư trú trên VNeID mức 2?',
  '📄 Hồ sơ đăng ký nhập học mầm non gồm những giấy tờ gì?',
  '🍲 Chế độ ăn bán trú và nguồn thực phẩm của trường thế nào?',
  '💰 Quy định về học phí và chính sách miễn giảm học phí cho trẻ 5 tuổi?',
  '⏰ Thời gian công bố kết quả xét duyệt hồ sơ trực tuyến?'
];

export const AIChatbotView: React.FC<{ onNavigateToRegister: () => void }> = ({ onNavigateToRegister }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Xin chào quý phụ huynh! 🌸\n\nTôi là **Trợ lý ảo AI Tuyển sinh** của ${SCHOOL_INFO.schoolName}.\n\nTôi có thể hỗ trợ quý phụ huynh giải đáp 24/7 về:\n- 👶 **Quy định độ tuổi** vào các khối Nhà trẻ và Mẫu giáo (3T, 4T, 5T)\n- 📱 **Hướng dẫn trích xuất thông tin cư trú trên VNeID** không cần sổ hộ khẩu\n- 📑 **Hồ sơ, thủ tục và các bước nộp phiếu tuyển sinh trực tuyến**\n- 🍲 **Chế độ dinh dưỡng bán trú, chương trình giáo dục mầm non**\n\nQuý phụ huynh có thể bấm chọn câu hỏi gợi ý bên dưới hoặc nhập trực tiếp câu hỏi nhé!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputVal).trim();
    if (!text || loading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      const botReply = data.reply || 'Xin lỗi, tôi chưa thể trả lời câu hỏi này lúc này. Quý phụ huynh vui lòng liên hệ hotline nhà trường để được hỗ trợ.';

      const assistantMsg: AIChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: AIChatMessage = {
        id: `ast-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Có lỗi kết nối mạng. Quý phụ huynh vui lòng gửi lại câu hỏi hoặc gọi trực tiếp Hotline Tuyển sinh: ' + SCHOOL_INFO.hotline,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown renderer helper for clean bullet points and bolding
  const renderFormattedText = (txt: string) => {
    const lines = txt.split('\n');
    return lines.map((line, idx) => {
      // Process bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <li key={idx} className="ml-4 list-disc my-1">
            {formattedParts}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-amber-300 flex items-center justify-center font-extrabold shadow-inner shrink-0">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Trợ Lý Ảo Tuyển Sinh Thông Minh (AI 24/7)
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Tư Vấn Tuyển Sinh Mầm Non
            </h2>
            <p className="text-purple-100 text-xs mt-0.5">
              Giải đáp chuẩn xác các thắc mắc về độ tuổi, VNeID, hồ sơ và chế độ bán trú.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToRegister}
          className="px-5 py-2.5 bg-white text-purple-700 hover:bg-purple-50 font-bold rounded-2xl text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5 hover:scale-105"
        >
          <GraduationCap className="w-4 h-4 text-rose-500" />
          <span>Đi đến Phiếu Đăng Ký</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[560px] overflow-hidden">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-rose-500 text-white'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-rose-500 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="text-xs">{renderFormattedText(msg.text)}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-rose-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>Cô giáo AI đang soạn câu trả lời...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" /> Gợi ý:
          </span>
          {QUICK_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] font-medium bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition-all shadow-2xs hover:border-purple-300 shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              placeholder="Nhập câu hỏi của quý phụ huynh về tuyển sinh..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />

            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-3 sm:px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
