declare module 'swagger-ui-react' {
  import * as React from 'react'

  interface SwaggerUIProps {
    url?: string
    spec?: object
    docExpansion?: 'list' | 'full' | 'none'
    deepLinking?: boolean
    presets?: any[]
    layout?: string
    [key: string]: any
  }

  const SwaggerUI: React.FC<SwaggerUIProps>
  export default SwaggerUI
}