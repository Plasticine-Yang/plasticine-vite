import React from 'react'

const { memo, useState, useCallback } = React

const App: React.FC = memo(() => {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    console.log('click')
    setCount((prevCount) => prevCount + 1)
  }, [])

  return (
    <div>
      <span>count: {count}</span>
      <button onClick={handleClick}>add</button>
    </div>
  )
})

export default App
