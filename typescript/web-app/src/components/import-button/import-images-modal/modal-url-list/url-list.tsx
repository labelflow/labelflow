import { ChangeEvent, useState } from "react";
import { Stack, VStack, Button, Textarea } from "@chakra-ui/react";
import { isWebUri } from "valid-url";
import { isEmpty } from "lodash/fp";
import { DroppedUrl } from "../types";

export const UrlList = ({
  onDropEnd,
}: {
  onDropEnd: (images: Array<DroppedUrl>) => void;
}) => {
  const [value, setValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <VStack spacing={4} flex="1" alignItems="stretch">
      <Button
        mt={2}
        onClick={() =>
          setValue(
            "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80\nhttps://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1569579933032-9e16447c50e3?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1595687453172-253f44ed3975?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1574082595167-86d59cefcc3a?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1504618223053-559bdef9dd5a?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1490718720478-364a07a997cd?auto=format&fit=crop&w=933&q=80\nhttps://images.unsplash.com/photo-1557054068-bf70b5f32470?auto=format&fit=crop&w=2098&q=80\nhttps://images.unsplash.com/photo-1580629905303-faaa03202631?auto=format&fit=crop&w=1001&q=80\nhttps://images.unsplash.com/photo-1562519990-50eb51e282b2?auto=format&fit=crop&w=2089&q=80\nhttps://images.unsplash.com/photo-1565085360602-de694f1d7650?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1594389615321-4f50c5d7878c?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1548613053-22087dd8edb8?auto=format&fit=crop&w=975&q=80\nhttps://images.unsplash.com/photo-1567672935596-057a100fcced?auto=format&fit=crop&w=933&q=80\nhttps://images.unsplash.com/photo-1540380403593-2f4cbbc006dd?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1503427315916-2ba435dee667?auto=format&fit=crop&w=882&q=80\nhttps://images.unsplash.com/photo-1589726096666-8bb135284e21?auto=format&fit=crop&w=2208&q=80\nhttps://images.unsplash.com/photo-1600632519223-ab235891238e?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1588593140187-15accd20e5c4?auto=format&fit=crop&w=2167&q=80\nhttps://images.unsplash.com/photo-1623139786346-49ed6e0d3f17?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1598368542823-bb3d59856578?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1522735338363-cc7313be0ae0?auto=format&fit=crop&w=2089&q=80\nhttps://images.unsplash.com/photo-1580500112694-8b1fd188016e?auto=format&fit=crop&w=2090&q=80\nhttps://images.unsplash.com/photo-1623029884339-6926ca66fd43?auto=format&fit=crop&w=2198&q=80\nhttps://images.unsplash.com/photo-1623175500269-275a00613feb?auto=format&fit=crop&w=1000&q=80\nhttps://images.unsplash.com/photo-1623169840544-0982db65d00e?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1623158844814-b47a2ba7e26e?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1623163624973-073ced380593?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623167968079-ecd12d4636eb?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623160533466-89e1100956a2?auto=format&fit=crop&w=1000&q=80\nhttps://images.unsplash.com/photo-1623150882391-ed961cb0eb4c?auto=format&fit=crop&w=2178&q=80\nhttps://images.unsplash.com/photo-1623158663801-7508f6170526?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1622901120958-ae569882629c?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623081660299-28f63e22c593?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623116135497-a90bdc0ddca9?auto=format&fit=crop&w=2167&q=80\nhttps://images.unsplash.com/photo-1623116964766-7f081cea2b24?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1623107231126-3115a3370389?auto=format&fit=crop&w=2104&q=80\nhttps://images.unsplash.com/photo-1622915984758-e4ac40643c39?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1622983472974-4c5a568beeec?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623038318872-d11e84a7e421?auto=format&fit=crop&w=2102&q=80\nhttps://images.unsplash.com/photo-1623081640407-8a0b9b8f5b84?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623135802537-fcca5cdf43d8?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623137473690-6a6380219f55?auto=format&fit=crop&w=2089&q=80\nhttps://images.unsplash.com/photo-1623131418931-11498160a47d?auto=format&fit=crop&w=1000&q=80\nhttps://images.unsplash.com/photo-1623009364046-5f419464e990?auto=format&fit=crop&w=2102&q=80\nhttps://images.unsplash.com/photo-1623135326548-215f047b1469?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1623000261482-fd95093395fb?auto=format&fit=crop&w=2104&q=80\nhttps://images.unsplash.com/photo-1587554801471-37976a256db0?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1623003641967-c43abbede243?auto=format&fit=crop&w=2102&q=80\nhttps://images.unsplash.com/photo-1623128077285-ca65de3d7582?auto=format&fit=crop&w=2194&q=80"
          )
        }
      >
        Insert example images
      </Button>
      <Stack
        as="form"
        border="1px dashed"
        borderColor="gray.700"
        borderRadius="md"
        bg="gray.50"
        flex="1"
      >
        <Textarea
          borderRadius="md"
          border="none"
          value={value}
          onChange={handleInputChange}
          placeholder="Enter your image URLs here, one per line. Example:&#13;&#10;https://example.com/image1.jpeg&#13;&#10;https://example.com/image2.jpeg"
          size="sm"
          h="full"
          resize="none"
        />
      </Stack>
      <Button
        onClick={() => {
          onDropEnd(
            value
              .split("\n")
              .filter((line) => !isEmpty(line))
              .map((url) => {
                if (!isWebUri(url)) {
                  return { url, errors: [new Error("Invalid URL")] };
                }
                return { url, errors: [] };
              })
          );
        }}
      >
        Start Import
      </Button>
    </VStack>
  );
};
