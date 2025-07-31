import TitleContent from './title-content';
import { Container } from '@/styles/home';

export default function InstagramContent() {
  return (
    <Container>
      <TitleContent title="Instagram" />
      <div className="flex flex-row ml-[16%] mr-[18%] gap-4">
        <div className="w-[40%] hover:*:shadow-2xl">
          <img
            className="w-full shadow-md object-cover rounded-2xl cursor-pointer"
            src="../../../public/images/라부부1.jpg"
            alt="라부부1"
          />
        </div>

        <div className="w-[40%] *:flex *:flex-row *:w-[47%] *:gap-4">
          <div className="mb-4 *:cursor-pointer hover:*:shadow-2xl">
            <img
              className="w-full object-cover rounded-2xl"
              src="../../../public/images/라부부2.png"
              alt="라부부2"
            />
            <img
              className="w-full object-cover rounded-2xl"
              src="../../../public/images/라부부3.jpg"
              alt="라부부3"
            />
            <img
              className="w-full object-cover rounded-2xl"
              src="../../../public/images/라부부4.jpg"
              alt="라부부4"
            />
          </div>
          <div className="mt-4 *:cursor-pointer hover:*:shadow-2xl">
            <img
              className="w-full object-cover rounded-2xl"
              src="../../../public/images/라부부5.jpg"
              alt="라부부5"
            />
            <img
              className="w-full object-cover rounded-2xl"
              src="../../../public/images/라부부6.jpeg"
              alt="라부부5"
            />
            <img
              className="w-full object-cover rounded-2xl"
              src="../../../public/images/라부부7.jpg"
              alt="라부부5"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
