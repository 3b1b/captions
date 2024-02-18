import data from "@/data/topic-completion.json";
import Completion from "@/pages/home/Completion";

function ByTopic() {
  return (
    <section>
      <h2>Completion by Topic</h2>

      <Completion data={data} />
    </section>
  );
}

export default ByTopic;
