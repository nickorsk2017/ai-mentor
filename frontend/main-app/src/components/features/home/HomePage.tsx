import { Container } from "@/components/layout/Container";
import { HomeHero } from "./HomeHero";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { HomeProblemSolution } from "./HomeProblemSolution";

export default function HomePage() {
  return (
    <Container className="mt-15 flex w-full flex-col gap-8 pb-8 md:mt-0">
      <HomeHero />
      <HomeProblemSolution />
      <HomeHowItWorks />
    </Container>
  );
}
