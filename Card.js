
// WhatsApp Configuration
        const CHAT_PROFILES = {
            matayo: {
                name: "Matayo Kamuntu",
                phone: "+256757760183", // Replace with your actual number
                image: "https://randomuser.me/api/portraits/men/1.jpg",
                status: "Uganda Travel Blogger",
                typing: false
            },
            father: {
                name: "James Kamuntu",
                phone: "+256XXXXXXXXX", // Replace with father's number
                image: "https://randomuser.me/api/portraits/men/40.jpg",
                status: "Farmer",
                typing: false
            },
            mother: {
                name: "Mary Kamuntu",
                phone: "+256XXXXXXXXX", // Replace with mother's number
                image: "https://randomuser.me/api/portraits/women/40.jpg",
                status: "Teacher",
                typing: false
            }
        };
        
        let currentUserPhone = null;
        let chatHistory = {};
        let currentChat = 'matayo';

        // DOM Elements
        const phoneModal = document.getElementById('phone-modal');
        const userPhoneInput = document.getElementById('user-phone');
        const phoneSubmit = document.getElementById('phone-submit');
        const whatsappButton = document.getElementById('whatsapp-button');
        const whatsappChat = document.getElementById('whatsapp-chat');
        const chatClose = document.getElementById('chat-close');
        const chatMessages = document.getElementById('chat-messages');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const chatProfileImg = document.getElementById('chat-profile-img');
        const chatProfileName = document.getElementById('chat-profile-name');
        const chatProfileStatus = document.getElementById('chat-profile-status');
        const typingIndicator = document.getElementById('typing-indicator');
        const chatFatherBtn = document.getElementById('chat-father');
        const chatMotherBtn = document.getElementById('chat-mother');

        // Initialize chat history
        function initChatHistory() {
            if (!localStorage.getItem('chatHistory')) {
                localStorage.setItem('chatHistory', JSON.stringify({}));
            }
            chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
            
            if (!chatHistory.matayo) chatHistory.matayo = [];
            if (!chatHistory.father) chatHistory.father = [];
            if (!chatHistory.mother) chatHistory.mother = [];
        }

        // Check if user has provided phone number
        function checkUserPhone() {
            if (localStorage.getItem('userPhone')) {
                currentUserPhone = localStorage.getItem('userPhone');
                phoneModal.style.display = 'none';
            } else {
                phoneModal.style.display = 'flex';
            }
        }

        // Save user phone number
        phoneSubmit.addEventListener('click', function() {
            const phone = userPhoneInput.value.trim();
            if (phone && phone.startsWith('+')) {
                currentUserPhone = phone;
                localStorage.setItem('userPhone', phone);
                phoneModal.style.display = 'none';
                initChatHistory();
                loadChat('matayo');
                
                // Check if number is on WhatsApp (simulated)
                setTimeout(() => {
                    console.log(`Verified ${phone} is on WhatsApp`);
                }, 1000);
            } else {
                alert('Please enter a valid phone number with country code (e.g., +256...)');
            }
        });

        // WhatsApp button click
        whatsappButton.addEventListener('click', function() {
            if (!currentUserPhone) {
                checkUserPhone();
                return;
            }
            whatsappChat.style.display = 'flex';
            loadChat(currentChat);
        });

        // Close chat
        chatClose.addEventListener('click', function() {
            whatsappChat.style.display = 'none';
        });

        // Add message to chat
        function addMessage(text, isReceived, isSystem = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isReceived ? 'received' : 'sent'}`;
            if (isSystem) messageDiv.className += ' system';
            messageDiv.textContent = text;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            messageDiv.appendChild(timeDiv);
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Send message
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                // Add to chat UI
                addMessage(message, false);
                
                // Save to chat history
                chatHistory[currentChat].push({
                    sender: 'user',
                    message: message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
                
                // Clear input
                messageInput.value = '';
                
                // Show typing indicator
                showTyping(true);
                
                // Open WhatsApp with the message
                const contact = CHAT_PROFILES[currentChat];
                const whatsappUrl = `https://wa.me/${contact.phone}?text=${encodeURIComponent(`Message from ${currentUserPhone}: ${message}`)}`;
                window.open(whatsappUrl, '_blank');
                
                // Simulate response after delay
                setTimeout(() => {
                    showTyping(false);
                    simulateResponse();
                }, 2000);
            }
        }

        // Show/hide typing indicator
        function showTyping(show) {
            CHAT_PROFILES[currentChat].typing = show;
            typingIndicator.style.display = show ? 'block' : 'none';
            if (show) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }

        // Simulate response from contact
        function simulateResponse() {
            const responses = {
                matayo: [
                    "Thanks for your message!",
                    "I'll get back to you soon about your Uganda travel questions.",
                    "How are you doing today?",
                    "Welcome to Uganda Travel Blog!",
                    "What would you like to know about Uganda?"
                ],
                father: [
                    "This is James responding.",
                    "I'm busy on the farm now, what do you need?",
                    "The crops are doing well this season.",
                    "I can show you around the village when you visit.",
                    "Have you been taking care of yourself?"
                ],
                mother: [
                    "Mary here, how can I help?",
                    "I'm teaching right now, can I call you later?",
                    "Education is very important for our children.",
                    "Have you been reading your books?",
                    "Let me know if you need help with anything."
                ]
            };
            
            const response = responses[currentChat][Math.floor(Math.random() * responses[currentChat].length)];
            addMessage(response, true);
            
            chatHistory[currentChat].push({
                sender: 'them',
                message: response,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }

        // Load chat history and update profile
        function loadChat(chat) {
            currentChat = chat;
            chatMessages.innerHTML = '';
            
            // Update chat profile
            const contact = CHAT_PROFILES[chat];
            chatProfileImg.src = contact.image;
            chatProfileName.textContent = contact.name;
            chatProfileStatus.textContent = contact.status;
            typingIndicator.style.display = 'none';
            
            // Add welcome message if empty
            if (chatHistory[chat].length === 0) {
                addMessage(`Hello! This is ${contact.name.split(' ')[0]}. How can I help you?`, true);
                return;
            }
            
            // Load existing messages
            chatHistory[chat].forEach(msg => {
                addMessage(msg.message, msg.sender !== 'user');
            });
        }

        // Initialize rotating text
        function initRotatingText() {
            const frontText = document.getElementById('front-text');
            const backText = document.getElementById('back-text');
            const text = "UGANDA BLOG ID • OFFICIAL VERIFICATION • PEARL OF AFRICA • ";
            
            for (let i = 0; i < text.length; i++) {
                const frontSpan = document.createElement('span');
                frontSpan.textContent = text[i];
                frontSpan.style.transform = `rotate(${i * (360 / text.length)}deg)`;
                frontText.appendChild(frontSpan);
                
                const backSpan = document.createElement('span');
                backSpan.textContent = text[i];
                backSpan.style.transform = `rotate(${i * (360 / text.length)}deg)`;
                backText.appendChild(backSpan);
            }
        }

        // Initialize photo click events
        function initPhotoEvents() {
            document.getElementById('profile-photo').addEventListener('click', function() {
                alert("This is Matayo Kamuntu - Uganda Travel Blogger");
            });

            document.getElementById('father-photo').addEventListener('click', function() {
                alert("This is James Kamuntu - Father and Farmer");
            });

            document.getElementById('mother-photo').addEventListener('click', function() {
                alert("This is Mary Kamuntu - Mother and Teacher");
            });
        }

        // Initialize parent chat buttons
        function initParentChatButtons() {
            chatFatherBtn.addEventListener('click', function() {
                if (!currentUserPhone) {
                    checkUserPhone();
                    return;
                }
                currentChat = 'father';
                whatsappChat.style.display = 'flex';
                loadChat('father');
            });

            chatMotherBtn.addEventListener('click', function() {
                if (!currentUserPhone) {
                    checkUserPhone();
                    return;
                }
                currentChat = 'mother';
                whatsappChat.style.display = 'flex';
                loadChat('mother');
            });
        }

        // Initialize decorative elements
        function initDecorations() {
            function createFloatingDecoration() {
                const decoration = document.createElement('div');
                decoration.className = 'decorative flower';
                decoration.style.left = Math.random() * 100 + '%';
                decoration.style.top = Math.random() * 100 + '%';
                decoration.style.opacity = Math.random() * 0.5 + 0.3;
                decoration.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
                decoration.style.animationDuration = Math.random() * 15 + 10 + 's';
                
                const side = Math.random() > 0.5 ? document.querySelector('.card-side') : document.querySelector('.back-side');
                side.appendChild(decoration);
            }

            // Create multiple decorations
            for (let i = 0; i < 5; i++) {
                createFloatingDecoration();
            }
        }

        // Initialize
        window.addEventListener('load', function() {
            initRotatingText();
            initPhotoEvents();
            initDecorations();
            initChatHistory();
            checkUserPhone();
            initParentChatButtons();
            
            // Set up send button
            sendButton.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') sendMessage();
            });
            
            // Set your profile image on the WhatsApp button
            const whatsappImg = whatsappButton.querySelector('img');
            whatsappImg.src = CHAT_PROFILES.matayo.image;
        });

const aboutBtn = document.getElementById('aboutBtn');
        
        aboutBtn.addEventListener('click', function() {
            // Navigate to about page (replace with your actual link)
            window.location.href = "index.html";
        });
