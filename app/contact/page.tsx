import FirstComponent from "./_components/FirstComponent"
import SecondComponent from "./_components/SecondComponent"
import Footer from "@/common/Footer"
import GoBack from "@/common/GoBack"

export default function Contact() {
    return (
        <>
            <section className="flex flex-col min-h-screen w-full bg-magenta-fuchsia-50">
                <GoBack url="/" />
                <div className="flex h-16 md:h-20 lg:h-24 justify-center items-center bg-magenta-fuchsia-500 w-full py-18">
                    <img className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14" src="logo-icon.png" alt="" />
                </div>
                
                <div className="flex flex-col lg:flex-row w-full flex-1 bg-magenta-fuchsia-50 py-12">
                    <FirstComponent />
                    <SecondComponent />
                </div>
                <Footer />
            </section>
        </>
    )
}