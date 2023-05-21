import Nav from "./Nav";

const PageLayout = ({ showNav, children }) => {
  return (
    <div className="flex h-screen flex-col dark:bg-gray-800">
      {showNav && <Nav />}

      <main className="grow bg-white p-8 dark:bg-gray-800">{children}</main>

      <footer className="justify-end bg-white p-4 dark:bg-gray-800">
        <p className="text-center font-light dark:text-white">
          Copyright 2023 Moja Kwa Moja
        </p>
      </footer>
    </div>
  );
};

export default PageLayout;
