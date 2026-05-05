// import { parseList } from "@/utils/parseList";
// import ResultCard from "./cards/ResultCard";

// interface PredictionResult {
//   predicted_disease?: string;
//   description?: string;
//   medications?: unknown;
//   diet?: unknown;
//   workout?: unknown;
//   precautions?: unknown;
// }

// interface Props {
//   result: PredictionResult;
// }

// const BulletList = ({ items }: { items: string[] }) => (
//   <ul className="list-disc list-inside space-y-1">
//     {items.map((item, i) => (
//       <li key={i} className="capitalize">
//         {item}
//       </li>
//     ))}
//   </ul>
// );

// const ResultSection = ({ result }: Props) => {
//   const medications = parseList(result.medications);
//   const diet = parseList(result.diet);
//   const workout = parseList(result.workout);
//   const precautions = parseList(result.precautions);

//   return (
//     <div className="w-full max-w-2xl mx-auto mt-10 space-y-5">
//       <ResultCard icon="🩺" title="Predicted Disease" delay={0}>
//         <p className="text-xl font-bold text-primary">
//           {result.predicted_disease ?? "Unknown"}
//         </p>
//       </ResultCard>

//       <ResultCard icon="📋" title="Description" delay={80}>
//         <p>{result.description ?? "No description available."}</p>
//       </ResultCard>

//       <ResultCard icon="💊" title="Medications" delay={160}>
//         {medications.length ? <BulletList items={medications} /> : <p>None</p>}
//       </ResultCard>

//       <ResultCard icon="🥗" title="Diet Recommendations" delay={240}>
//         {diet.length ? <BulletList items={diet} /> : <p>None</p>}
//       </ResultCard>

//       <ResultCard icon="🏋️" title="Workout Suggestions" delay={320}>
//         {workout.length ? <BulletList items={workout} /> : <p>None</p>}
//       </ResultCard>

//       <ResultCard icon="⚠️" title="Precautions" delay={400}>
//         {precautions.length ? <BulletList items={precautions} /> : <p>None</p>}
//       </ResultCard>
//     </div>
//   );
// };

// export default ResultSection;
import { parseList } from "@/utils/parseList";
import ResultCard from "./cards/ResultCard";

// interface PredictionResult {
//   predicted_disease?: string;
//   description?: string;
//   medications?: unknown;
//   diet?: unknown;
//   workout?: unknown;
//   precautions?: unknown;
// }
//new codes
interface PredictionItem {
  rank: number;
  disease: string;
  probability: number;
}

interface PredictionResult {
  top_predictions?: PredictionItem[];
  primary_details?: {
    disease: string;
    description?: string;
    medications?: unknown;
    diet?: unknown;
    workout?: unknown;
    precautions?: unknown;
  };
}
interface Props {
  result: PredictionResult;
}

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside space-y-1">
    {items.map((item, i) => (
      <li key={i} className="capitalize">
        {item}
      </li>
    ))}
  </ul>
);

// const ResultSection = ({ result }: Props) => {
//   const medications = parseList(result.medications);
//   const diet = parseList(result.diet);
//   const workout = parseList(result.workout);
//   const precautions = parseList(result.precautions);

//   return (
//     <div className="w-full max-w-2xl mx-auto mt-10 space-y-5">
//       <ResultCard icon="🩺" title="Predicted Disease" delay={0}>
//         <p className="text-xl font-bold text-primary">
//           {result.predicted_disease ?? "Unknown"}
//         </p>
//       </ResultCard>

//       <ResultCard icon="📋" title="Description" delay={80}>
//         <p>{result.description ?? "No description available."}</p>
//       </ResultCard>

//       <ResultCard icon="💊" title="Medications" delay={160}>
//         {medications.length ? <BulletList items={medications} /> : <p>None</p>}
//       </ResultCard>

//       <ResultCard icon="🥗" title="Diet Recommendations" delay={240}>
//         {diet.length ? <BulletList items={diet} /> : <p>None</p>}
//       </ResultCard>

//       <ResultCard icon="🏋️" title="Workout Suggestions" delay={320}>
//         {workout.length ? <BulletList items={workout} /> : <p>None</p>}
//       </ResultCard>

//       <ResultCard icon="⚠️" title="Precautions" delay={400}>
//         {precautions.length ? <BulletList items={precautions} /> : <p>None</p>}
//       </ResultCard>
//     </div>
//   );
  
// };
const ResultSection = ({ result }: Props) => {
  const topPredictions = result.top_predictions || [];
  const details = result.primary_details;

  const medications = parseList(details?.medications);
  const diet = parseList(details?.diet);
  const workout = parseList(details?.workout);
  const precautions = parseList(details?.precautions);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 space-y-5">

      {/* 🔥 TOP 3 LIST */}
      <ResultCard icon="🩺" title="Top Predictions" delay={0}>
        {topPredictions.length ? (
          <ul className="space-y-2">
            {topPredictions.map((item) => (
              <li key={item.rank} className="text-lg font-semibold">
                {/* {item.rank}. {item.disease} ({item.probability}%) */}
                 {item.rank}. {item.disease}

              </li>
            ))}
          </ul>
        ) : (
          <p>No predictions available</p>
        )}
      </ResultCard>

      {/* 🔥 ONLY TOP 1 DETAILS */}
      <ResultCard icon="📋" title="Description" delay={80}>
        <p>{details?.description ?? "No description available."}</p>
      </ResultCard>

      <ResultCard icon="💊" title="Medications" delay={160}>
        {medications.length ? <BulletList items={medications} /> : <p>None</p>}
      </ResultCard>

      <ResultCard icon="🥗" title="Diet Recommendations" delay={240}>
        {diet.length ? <BulletList items={diet} /> : <p>None</p>}
      </ResultCard>

      <ResultCard icon="🏋️" title="Workout Suggestions" delay={320}>
        {workout.length ? <BulletList items={workout} /> : <p>None</p>}
      </ResultCard>

      <ResultCard icon="⚠️" title="Precautions" delay={400}>
        {precautions.length ? <BulletList items={precautions} /> : <p>None</p>}
      </ResultCard>
    </div>
  );
};
export default ResultSection;
