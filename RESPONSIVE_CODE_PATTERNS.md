# 🎯 RESPONSIVE MODERNIZATION - CODE PATTERNS GUIDE

## 📱 Mobile-First Responsive Patterns

### 1. Responsive Spacing Pattern
```jsx
// Mobile-first: start with small, increase on larger screens
className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"

// Consistent gap sizing
className="gap-1 sm:gap-2 md:gap-4"

// Padding in containers
className="p-3 sm:p-4 md:p-6"
```

### 2. Responsive Typography
```jsx
// Font sizes scale with screen size
className="text-xs sm:text-sm md:text-base lg:text-lg"

// Responsive line clamps
className="line-clamp-2 sm:line-clamp-3 md:line-clamp-1"
```

### 3. Responsive Display
```jsx
// Show/hide elements by screen size
className="hidden sm:block md:block"  // Hidden on mobile
className="block md:hidden"            // Hidden on desktop

// Responsive columns
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

### 4. Responsive Width
```jsx
// Fixed on mobile, flexible on desktop
className="w-full sm:w-72 md:w-80 lg:w-96"

// Max widths for large screens
className="max-w-full md:max-w-md lg:max-w-lg"
```

---

## 🎨 Color & Styling Patterns

### Dark/Light Mode Pattern
```jsx
className={`${
  isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-gray-100' 
    : 'bg-white border-gray-200 text-gray-900'
} transition-colors duration-200`}
```

### Hover State Pattern
```jsx
className={`transition-colors ${
  isDarkMode
    ? 'hover:bg-gray-700 text-gray-300'
    : 'hover:bg-gray-100 text-gray-600'
}`}
```

### Glass Effect Pattern
```jsx
className="bg-gray-800/70 backdrop-blur-md border border-white/10"
```

---

## ⚡ Animation Patterns

### Button Interaction Pattern (Framer Motion)
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
  Click me
</motion.button>
```

### Smooth Rotation Pattern
```jsx
<motion.button
  whileHover={{ scale: 1.05, rotate: 10 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
  Rotate me
</motion.button>
```

### Content Fade Pattern
```jsx
<motion.div
  key={id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  className="..."
>
  Fading content
</motion.div>
```

### Stagger Animation Pattern
```jsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 📱 Mobile-Specific Patterns

### Screen Size Detection
```jsx
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Mobile Drawer Pattern
```jsx
{/** Mobile Backdrop */}
{isMobile && isOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-black/50 z-30"
  />
)}

{/** Drawer */}
<motion.div
  variants={isMobile ? sidebarVariants : { hidden: { x: 0 }, visible: { x: 0 } }}
  initial={isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible'}
  animate={isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible'}
  className={isMobile ? 'fixed left-0 top-0 h-screen' : 'relative'}
>
  {/* Content */}
</motion.div>
```

### Responsive Popup Pattern
```jsx
{/* Desktop: absolute positioned dropdown */}
{/* Mobile: fixed bottom popup */}
className={`${
  isMobile
    ? 'fixed bottom-4 left-4 right-4 max-w-sm'
    : 'absolute -right-2 top-14 w-96'
} ...`}
```

### Toast Position Pattern
```jsx
<ToastContainer
  position={isMobile ? 'bottom-center' : 'bottom-right'}
  autoClose={3000}
  theme={isDarkMode ? 'dark' : 'light'}
/>
```

---

## 🔧 Accessibility Patterns

### ARIA Labels
```jsx
<button 
  aria-label="Toggle sidebar"
  title="Toggle sidebar"
  onClick={onToggle}
>
  <Menu />
</button>
```

### Keyboard Support
```jsx
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, [isOpen, onClose]);
```

---

## 🎯 Performance Patterns

### Memoized Callback
```jsx
const handleToggleSidebar = useCallback(() => {
  setSidebarOpen(prev => !prev);
}, []);
```

### Conditional Rendering
```jsx
{notifications.length > 0 && (
  <motion.button onClick={clearAll} className="...">
    Clear All
  </motion.button>
)}
```

### Optimized Event Handlers
```jsx
const handleTabClick = (tabId) => {
  setActiveTab(tabId);
  // Only close drawer on mobile
  if (isMobile && isOpen) {
    onToggle();
  }
};
```

---

## 📋 Component Structure Pattern

```jsx
function MyComponent({ prop1, prop2 }) {
  // 1. State management
  const [state, setState] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 2. Store/Context hooks
  const { isDarkMode } = useStore();

  // 3. Effects
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 4. Memoized callbacks
  const handleClick = useCallback(() => {
    // Logic here
  }, []);

  // 5. Render
  return (
    <div className="responsive-classes">
      {/* JSX here */}
    </div>
  );
}
```

---

## 🌈 Complete Component Example

```jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/store';

function ResponsiveModal({ isOpen, onClose }) {
  const { isDarkMode } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.95 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
            exit={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.95 }}
            className={`${
              isMobile
                ? 'fixed bottom-0 left-0 right-0 rounded-t-2xl'
                : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl'
            } ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl z-50 w-full max-w-md p-4 sm:p-6`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Title</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`p-2 rounded ${
                  isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="text-sm sm:text-base">
              Modal content here
            </div>

            {/* Footer */}
            <div className="flex gap-2 mt-4 sm:mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded transition"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {/* action */}}
                className="flex-1 px-4 py-2 rounded bg-blue-600 text-white transition"
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default ResponsiveModal;
```

---

## 📚 Quick Reference

### Tailwind Responsive Prefixes
- `sm:` → 640px (small phones)
- `md:` → 768px (tablets)
- `lg:` → 1024px (laptops)
- `xl:` → 1280px (desktops)

### Common Patterns
- **Spacing:** `px-3 sm:px-4 md:px-6`
- **Text:** `text-xs sm:text-sm md:text-base`
- **Flex:** `flex-col md:flex-row`
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Animation Timing
- **Hover:** `whileHover={{ scale: 1.05 }}`
- **Tap:** `whileTap={{ scale: 0.95 }}`
- **Stagger:** `transition={{ staggerChildren: 0.05 }}`

---

**These patterns can be reused throughout your component library!**

