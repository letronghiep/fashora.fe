import { CloseOutlined, MenuOutlined, MessageOutlined, RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateChatContextMutation, useGetChatContextQuery } from '../apis/chatApis';
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const [createChatContext, { isLoading }] = useCreateChatContextMutation();
  const { data: chatContext, isLoading: isLoadingGetChatContext } = useGetChatContextQuery();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  // Khi mở popup, nếu chưa có tin nhắn thì gửi tin nhắn chào mừng từ admin
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          content: 'Xin chào, tôi là Admin. Tôi có thể giúp gì cho bạn?',
          sender: 'AI',
          timestamp: new Date(),
          isAI: true
        }
      ]);
      if (chatContext && chatContext.metadata) {
        setMessages(chatContext?.metadata?.messages);
      }
    }
  }, [isOpen, messages]);

  // Hàm gọi AI trả lời (giả lập hoặc gọi API thực tế)
  const handleAIResponse = async () => {
    // Giả lập gọi API AI trả lời
    // setTimeout(() => {
    //   const aiResponse = {
    //     content: `Cảm ơn bạn đã nhắn tin! Tôi là Admin, tôi sẽ hỗ trợ bạn ngay.`,
    //     sender: 'AI',
    //     timestamp: new Date(),
    //     isAI: true
    //   };
    // }, 1000);
    const aiResponse = chatContext?.metadata?.messages[chatContext?.metadata?.messages?.length - 1];
    setMessages(prevMessages => [...prevMessages, aiResponse]);
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        sender: user?.usr_id || 'user',
        timestamp: new Date(),
        isUser: true,
      };
      setMessages(prevMessages => [...prevMessages, messageData]);
      setNewMessage('');
      await createChatContext({ content: newMessage });
      handleAIResponse();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      width: isOpen ? 350 : 320,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderRadius: 10,
      overflow: 'hidden',
      background: '#fff',
      transition: 'all 0.3s',
    }}>
      {/* Header */}
      <div
        style={{
          background: 'rgb(24, 144, 255)',
          color: '#fff',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageOutlined style={{ fontSize: 20 }} />
          <span style={{ fontWeight: 600 }}>Fashora</span>
          {isOpen && <span style={{ fontWeight: 400, fontSize: 13, marginLeft: 8 }}>Chat với chúng tôi</span>}
        </div>
        <div>
          {isOpen ? (
            <CloseOutlined style={{ fontSize: 18 }} />
          ) : (
            <MenuOutlined style={{ fontSize: 18 }} />
          )}
        </div>
      </div>
      {/* Nội dung chat */}
      {isOpen && (
        <div style={{ padding: 12, background: '#fff' }}>
          <div style={{ height: 300, overflowY: 'auto', marginBottom: 10 }}>
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={(message) => (
                <List.Item style={{
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  padding: '5px 10px'
                }}>
                  <div style={{
                    maxWidth: '70%',
                    backgroundColor: message.isUser ? '#1890ff' : '#f0f2f5',
                    padding: '8px 12px',
                    borderRadius: 8,
                    color: message.isUser ? 'white' : 'black'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar size="small" icon={message.isUser ? <UserOutlined /> : <RobotOutlined />} />
                      <Typography.Text style={{ color: message.isUser ? 'white' : 'black' }}>
                            {message.content}
                        </Typography.Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div ref={messagesEndRef} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập nội dung..."
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
            >
              Gửi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
