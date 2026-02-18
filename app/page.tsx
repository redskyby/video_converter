import Header from "@/components/Header";
import CheckBoxes from "@/components/CheckBoxes";

export default function Home() {
  return (
      <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
         <Header/>
          <CheckBoxes/>
      </div>
  );
}
