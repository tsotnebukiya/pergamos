import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <div className="flex h-16 shrink-0 items-center">
      <Image
        className="h-8 w-8"
        src={"https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"}
        alt="App Logo"
        width={32}
        height={32}
      />
    </div>
  );
};

export default Logo;
