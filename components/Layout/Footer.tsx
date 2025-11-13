// components/Layout/Footer.tsx

const Footer: React.FC = () => {
  return (
    <footer className="h-10 flex items-center justify-center px-4 border-t border-border-subtle bg-background-elevated/80 text-[11px] text-text-muted">
      <span>
        FinIA • Seu copiloto financeiro • {new Date().getFullYear()}
      </span>
    </footer>
  );
};

export default Footer;