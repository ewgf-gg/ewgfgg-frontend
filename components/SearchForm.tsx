import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import EWGFLoadingBarAnimation from '@/components/EWGFLoadingAnimation';
import { SearchFormProps } from "@/app/state/types/tekkenTypes";


export const SearchForm: React.FC<SearchFormProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading,
  errorMessage
}) => (
  <motion.div
    className="max-w-xl mx-auto mb-4"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {isLoading ? (
      <EWGFLoadingBarAnimation />
    ) : (
      <form onSubmit={handleSearch} className="flex items-center">
        <Input
          type="text"
          placeholder="Search player name..."
          className="flex-grow mr-2 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
        />
      </form>
    )}
    {!isLoading && errorMessage && (
      <motion.div
        className="text-red-500 mt-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {errorMessage}
      </motion.div>
    )}
  </motion.div>
);