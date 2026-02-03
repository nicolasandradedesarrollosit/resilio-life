import { GoBack } from "@/shared/components/ui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col min-h-screen w-full bg-magenta-fuchsia-50">
      <GoBack url="/login" />
      <div className="flex h-16 md:h-20 lg:h-24 justify-center items-center bg-magenta-fuchsia-500 w-full py-18">
        <img
          alt=""
          className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
          src="/logo-icon.png"
        />
      </div>

      <div className="flex flex-col justify-center lg:flex-row w-full flex-1 bg-magenta-fuchsia-50 py-12">
        {children}
      </div>
    </section>
  );
}
