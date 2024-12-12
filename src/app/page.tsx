import HeaderBtns from "./components/HeaderBtns";
import Navbar from "./components/Navbar";
import HeaderForm from "./components/HeaderForm";
import FeatureSection from "./components/FeatureSection";
import CustomButton from "./components/shared/CustomButton";
import Footer from "./components/shared/Footer";
import BookingModal from "./components/BookingModal";
import ScheduleCallBtn from "./components/shared/ScheduleCallBtn";
import ImageContainer from "./components/shared/ImageContainer";

export default function Home() {
  return (
    <main className="min-w-full w-full">
      <header className="w-full h-full ">
        <HeaderBtns />
        <Navbar />
        <BookingModal />
        <div className="header-contents flex-center w-full  min-h-[980px] h-[100svh] lg:min-h-[70svh] lg:h-full my-10">
          <div className="w-11/12 lg:w-11/12 flex justify-evenly items-start flex-col lg:flex-row flex-wrap lg:flex-nowrap">
            <div className="cta-content flex-start items-start h-full flex-col gap-6 w-full lg:w-4/12">
              <div className="cta-content-header w-full relative">
                <div className="absolute -top-28 left-1">
                  <ImageContainer
                    src="/icons/arrow_on_flowspark.png"
                    alt="Flowspark Arrow"
                    className="absolute float-down w-[194px] h-[147.36px]"
                    fill
                  />
                </div>

                <h1 className="text-4xl font-isidora font-semibold lg:text-5xl">
                  FlowSpark
                </h1>
                <p className="uppercase font-semibold font-sans">
                  Digital Marketing Solutions
                </p>
              </div>
              <div className="cta-content-description">
                <p>
                  We believe that marketing shouldn&apos;t be a headache, so
                  we&apos;ve crafted a platform that&apos;s super easy to use
                  but doesn&apos;t skimp on the powerful stuff.
                </p>
              </div>
              <div className="flex-center w-full">
                <ImageContainer
                  src="/icons/Illustration.png"
                  alt="Illustration"
                  fill
                  className="w-[223px] h-[225.8px]"
                />
              </div>
            </div>
            <div className="w-full lg:w-5/12">
              <HeaderForm />
            </div>
          </div>
        </div>
      </header>

      <FeatureSection />

      <section className="flex-center w-full my-40">
        <div className="flex-center flex-col gap-9 w-11/12">
          <h2 className="text-3xl lg:text-4xl font-quicksand font-semibold text-center text-text-body">
            Want to see how we can help?
          </h2>
          <p className="text-text-body w-full lg:w-5/12 xl:w-4/12 text-center">
            Ready to transform your marketing? Book a demo or start your free
            trial today and see firsthand how we can make your marketing efforts
            more effective and enjoyable!
          </p>
          <div className="flex-center flex-col gap-4">
            <div className="flex-center flex-wrap lg:flex-nowrap gap-4 relative">
              <ScheduleCallBtn />
              <CustomButton
                isLink
                href={"/"}
                btnName="Start a free trial"
                invertBtn
              />
              <div className="absolute right-2 -bottom-14 lg:-right-32 lg:-bottom-10">
                <ImageContainer
                  src="/icons/pointy_arrow.png"
                  alt="arrow pointing to start a free trial"
                  className="float-up"
                  w={120}
                  h={120}
                />
              </div>
            </div>
            <p className="text-accent mt-5 lg:mt-0">
              Free 14 day trial. Cancel anytime
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
