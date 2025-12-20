import GoBack from "@/common/GoBack"
import FormLogIn from "./_components/FormLogIn"

export default function LogInPage() {
    return (
        <section className="flex flex-col min-h-screen w-full bg-magenta-fuchsia-50">
            <GoBack url="/" />
            <div className="flex h-16 md:h-20 lg:h-24 justify-center items-center bg-magenta-fuchsia-500 w-full py-18">
                <img className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14" src="logo-icon.png" alt="" />
            </div>
            
            <div className="flex flex-col justify-center lg:flex-row w-full flex-1 bg-magenta-fuchsia-50 py-12">
                <FormLogIn />
            </div>
        </section>
    )
}

