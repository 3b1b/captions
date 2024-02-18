import { sortBy, startCase } from "lodash";
import Badge from "@/pages/home/Badge";
import classes from "./Completion.module.css";

type Props = {
  data: Record<string, number>;
};

/** grid of completion badges */
function Completion({ data }: Props) {
  const entries = sortBy(Object.entries(data), (entry) => entry[1]);

  return (
    <div className={classes.grid}>
      {entries.map(([name, completion], index) => (
        <Badge key={index} completion={completion}>
          {startCase(name)}
        </Badge>
      ))}
    </div>
  );
}

export default Completion;
