import ReMarkDown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export interface Props {
  content: string
}

export const MarkDown: React.FC<Props> = ({ content }: Props) => {
  return (
    <ReMarkDown
      components={{
        pre: ({ children }) => (
          <pre className="whitespace-pre-wrap">{children}</pre>
        )
      }}
      remarkPlugins={[ remarkGfm ]}>
      {content}
    </ReMarkDown>
  )
}
