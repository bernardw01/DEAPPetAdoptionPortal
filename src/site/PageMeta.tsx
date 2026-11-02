type PageMetaProps = {
  title: string
  description: string
}

export function PageMeta({ title, description }: PageMetaProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  )
}
