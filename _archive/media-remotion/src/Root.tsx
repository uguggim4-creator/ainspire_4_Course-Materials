import { Composition } from "remotion";
import { Caption } from "./Caption";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Caption"
      component={Caption}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
