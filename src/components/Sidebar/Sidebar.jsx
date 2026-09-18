// src/components/Sidebar/Sidebar.jsx
const CHATS = [
  { id: 1, title: "How to use AI Tools API in React Application" },
  { id: 2, title: "Gemini AI vs ChatGPT" },
  { id: 3, title: "Comparising Models for Popular AI Tools" },
  { id: 4, title: "How to use AI tools in your daily life" },
  { id: 5, title: "How to use AI tools in your daily work" },
];

export function Sidebar({ chats = CHATS, activeChatId = 1 }) {
  return (
    <aside className="flex-shrink-0 w-64 p-2 rounded-2xl bg-gray-100 dark:bg-gray-800 h-full overflow-y-auto">
      <ul className="flex flex-col gap-2 m-0 p-0 list-none">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`
              data-[active=true]:[&_button]:bg-white 
              data-[active=true]:[&_button]:dark:bg-gray-700
              data-[active=true]:[&_button]:border-transparent
              data-[active=true]:[&_button]:cursor-default
            `}
            data-active={chat.id === activeChatId}
          >
            <button
              className="w-full p-3 bg-transparent border border-transparent rounded-lg text-left cursor-pointer 
                         hover:border-gray-300 dark:hover:border-gray-600
                         transition-colors duration-200"
            >
              <div className="truncate text-sm text-gray-700 dark:text-gray-300">
                {chat.title}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}