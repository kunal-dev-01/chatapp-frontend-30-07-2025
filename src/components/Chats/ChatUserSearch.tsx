import React from 'react'
import { Search} from 'lucide-react'

const ChatUserSearch = () => {

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        <div className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white focus-within:shadow-lg">
          <Search className="w-5 h-5 ml-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-800 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  )
}

export default ChatUserSearch