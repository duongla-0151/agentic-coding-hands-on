interface LoginFooterProps {
  text: string;
}

export function LoginFooter({ text }: LoginFooterProps) {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 text-center text-white text-sm"
      style={{
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
      }}
    >
      {text}
    </footer>
  );
}
