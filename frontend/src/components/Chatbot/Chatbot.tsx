import { useState } from 'react';
import { sendChatMessage } from '../../api';

// --- Types ---
type Message = {
  role: 'user' | 'bot';
  text?: string;
  report?: {
    carbs: number;
    protein: number;
    fats: number;
  };
  healthTip?: string;
  info?: string;
  timestamp?: Date;
};

type MiniReportProps = {
  carbs: number;
  protein: number;
  fats: number;
};

type ChatBubbleProps = {
  onClick: () => void;
};

type ChatWindowProps = {
  onClose: () => void;
};

// --- Sub-components ---

// --- Helper ---
const formatTimeAgo = (date?: Date) => {
  if (!date) return 'Just now';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MiniReport = ({ carbs, protein, fats }: MiniReportProps) => {
  return (
    <div className='mt-2 flex flex-wrap gap-2 animate-fade-in'>
      <div className='bg-[#2a2a2a] border border-[#00a376] px-3 py-1.5 rounded-full text-[12px] text-gray-300 flex items-center gap-1.5 shadow-sm'>
        <span className='w-2 h-2 rounded-full bg-blue-400'></span>
        <span className='font-medium text-white'>{carbs}g</span> Carbs
      </div>
      <div className='bg-[#2a2a2a] border border-[#00a376] px-3 py-1.5 rounded-full text-[12px] text-gray-300 flex items-center gap-1.5 shadow-sm'>
        <span className='w-2 h-2 rounded-full bg-purple-400'></span>
        <span className='font-medium text-white'>{protein}g</span> Protein
      </div>
      <div className='bg-[#2a2a2a] border border-[#00a376] px-3 py-1.5 rounded-full text-[12px] text-gray-300 flex items-center gap-1.5 shadow-sm'>
        <span className='w-2 h-2 rounded-full bg-yellow-400'></span>
        <span className='font-medium text-white'>{fats}g</span> Fats
      </div>
    </div>
  );
};

const ChatBubble = ({ onClick }: ChatBubbleProps) => {
  return (
    <button
      onClick={onClick}
      className='fixed bottom-6 right-6 w-[60px] h-[60px] rounded-full bg-[#111] text-white border border-[#333] text-2xl cursor-pointer z-[1000] flex items-center justify-center shadow-lg transition-transform hover:scale-105'
      aria-label='Open NutriBot'
    >
      <img
        src='/Nutrilens_logo.png'
        alt='nutribot'
        width={30}
        height={30}
        className='w-[30px] h-[30px] object-contain'
      />
    </button>
  );
};

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: '👋 Hi! I’m NutriBot. Ask me anything about your food.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage.text || '');
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: response.text,
          report: response.report,
          healthTip: response.healthTip,
          info: response.info,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Sorry, I’m having trouble connecting right now. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed bottom-24 right-6 w-[450px] h-[700px] bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-[1000] overflow-hidden font-sans transition-all duration-300 animate-fade-in-up'>
      {/* Header */}
      <div className='px-5 py-4 bg-[#111]/90 backdrop-blur-md border-b border-white/5 flex justify-between items-center z-10'>
        <div className='flex items-center gap-3.5'>
          <div className='relative'>
            <img src='/Nutrilens_logo.png' alt='bot' className='w-10 h-10 object-contain' />
            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ff9d] border-2 border-[#111] rounded-full'></span>
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <strong className='text-[15px] font-semibold tracking-normal text-white'>
                NutriBot
              </strong>
              <span className='px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#00a376]/20 text-[#00a376] border border-[#00a376]/30'>
                AI
              </span>
            </div>
            <p className='text-[11px] text-gray-400 font-medium mt-0.5'>Always here to help you</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className='w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] animate-fade-in ${
              msg.role === 'user' ? 'self-end' : 'self-start'
            }`}
          >
            <div
              className={`p-3.5 px-5 rounded-2xl text-[14px] leading-relaxed shadow-sm relative ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#00a376] to-[#008f67] text-white rounded-br-none'
                  : 'bg-[#1f1f1f] text-gray-100 border border-white/5 rounded-bl-none'
              }`}
            >
              {msg.text && <div className='mb-1 last:mb-0'>{msg.text}</div>}

              {msg.healthTip && (
                <div className='mt-3 p-2 bg-[#2a2a2a] rounded-lg border border-[#00a376] text-xs text-gray-300'>
                  <strong className='text-[#00a376]'>💡 Tip:</strong> {msg.healthTip}
                </div>
              )}

              {msg.info && (
                <div className='mt-3 p-2 bg-[#2a2a2a] rounded-lg border border-[#00a376] text-xs text-gray-300'>
                  <strong className='text-[#00a376]'>ℹ️ Info:</strong> {msg.info}
                </div>
              )}
            </div>

            {msg.report && (
              <div className='mt-2 ml-1'>
                <MiniReport
                  carbs={msg.report.carbs}
                  protein={msg.report.protein}
                  fats={msg.report.fats}
                />
              </div>
            )}

            <div
              className={`text-[10px] text-gray-500 mt-1.5 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              {msg.role === 'user' ? 'You' : 'NutriBot'} • {formatTimeAgo(msg.timestamp)}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className='p-4 pb-5 bg-gradient-to-t from-[#0a0a0a] to-transparent'>
        <div className='flex gap-2 items-center bg-[#1a1a1a] p-1.5 pr-2 rounded-[24px] border border-white/10 shadow-lg ring-1 ring-white/5 focus-within:ring-[#00a376] transition-all'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder='Ask about your food...'
            className='flex-1 px-4 py-2.5 bg-transparent border-none outline-none text-white text-[14px] placeholder-gray-500'
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              input.trim() && !isLoading
                ? 'bg-[#00a376] text-white shadow-[#00a376]/40 shadow-lg hover:bg-[#00b583] hover:scale-105 active:scale-95'
                : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className='w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></div>
            ) : (
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={input.trim() ? 'ml-0.5' : ''}
              >
                <line x1='22' y1='2' x2='11' y2='13'></line>
                <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
              </svg>
            )}
          </button>
        </div>
        <div className='text-center mt-3'>
          <span className='text-[10px] text-gray-600 font-medium'>
            Powered by AI • Nutritional Info
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Chatbot Component ---

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatBubble onClick={() => setIsOpen(true)} />
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default Chatbot;
