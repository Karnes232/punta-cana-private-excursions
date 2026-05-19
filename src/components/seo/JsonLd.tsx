interface JsonLdProps {
  data: string | object | null | undefined;
}

export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  let payload: string;
  if (typeof data === "string") {
    try {
      JSON.parse(data);
      payload = data;
    } catch {
      return null;
    }
  } else {
    payload = JSON.stringify(data);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}
