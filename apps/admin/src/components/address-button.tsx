import { Button } from '@appabbang/ui';
import { useDaumPostcodePopup } from 'react-daum-postcode';

interface AdressButtonProps {
  setValue: (arg: any) => void;
  className?: string;
}

function AdressButton({ setValue, className }: AdressButtonProps) {
  const open = useDaumPostcodePopup();

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setValue(fullAddress);
  };

  const handleClick = () => {
    open({
      onComplete: handleComplete,
      width: '576',
      top: window.screen.height / 4,
      left: window.screen.width / 2 - 576,
    });
  };

  return (
    <Button variant="outline" onClick={handleClick} type="button" className={className}>
      주소 찾기
    </Button>
  );
}

export default AdressButton;
