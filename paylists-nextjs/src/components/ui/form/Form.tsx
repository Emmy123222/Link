import React from 'react'

const Form = ({ children, className, onSubmit }: { children: React.ReactNode, className?: string, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) => {
  return (
    <form className={`bg-white rounded-xl p-6 shadow-md max-w-5xl mx-auto max-h-[70vh] overflow-y-auto ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export default Form