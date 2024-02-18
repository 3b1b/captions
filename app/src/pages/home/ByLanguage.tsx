import data from "@/data/language-completion.json";
import Completion from "@/pages/home/Completion";

function ByLanguage() {
  return (
    <section>
      <h2>Completion by Language</h2>

      <Completion data={data} />
    </section>
  );
}

export default ByLanguage;
