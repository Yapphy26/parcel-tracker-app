import FuzzyText from "@components/ui/FuzzyText";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="flex justify-center">
        <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={0.8}
        enableHover={true}
        fontSize={"90px"}
      >
        404
      </FuzzyText>
      </h1>
      <h2 className="flex justify-center">
        <FuzzyText
        baseIntensity={0.01}
        hoverIntensity={0.5}
        enableHover={true}
        fontSize={"14px"}
        fontWeight={"400"}
      >
        This page could not be found.
      </FuzzyText>
      </h2>
    </div>
  );
}
