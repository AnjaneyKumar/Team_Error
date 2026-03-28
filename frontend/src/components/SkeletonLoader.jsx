import { motion } from 'framer-motion';

export function SkeletonCard({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-24 rounded-2xl skeleton"
        />
      ))}
    </div>
  );
}

export function SkeletonRouteList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="space-y-2 p-4 rounded-2xl skeleton"
        >
          <div className="h-4 w-24 skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-3 w-full skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex gap-2">
            <div className="h-2 w-12 skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-12 skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-12 skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonBusList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="p-4 rounded-2xl skeleton space-y-2"
        >
          <div className="flex justify-between">
            <div className="h-4 w-20 skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-4 w-16 skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
          <div className="h-2 w-full skeleton rounded bg-gray-300 dark:bg-gray-600"></div>
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonSearchResult() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 skeleton rounded-lg"
        />
      ))}
    </div>
  );
}

export function SkeletonMap() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="w-full h-full skeleton"
    />
  );
}
