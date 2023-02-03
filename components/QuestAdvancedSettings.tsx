import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  FormLabel,
  Select,
  Switch,
  Text,
} from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { QuestAdvSetting } from './CreateChain/QuestsForm';

type Props = {
  questAdvSetting: QuestAdvSetting;
  setQuestAdvSetting: Dispatch<SetStateAction<QuestAdvSetting>>;
};

const QuestAdvancedSettings = ({
  questAdvSetting,
  setQuestAdvSetting,
}: Props) => {
  const [isAdvancedSetOpen, setIsAdvancedSetOpen] = useState(false);

  return (
    <div>
      <Flex
        flexDirection={'row'}
        justify={'space-evenly'}
        align={'center'}
        w={'100%'}
        gap={'1'}
        my={'0.5rem'}
        cursor={'pointer'}
        onClick={() => setIsAdvancedSetOpen(prev => !prev)}
      >
        <Divider />
        <Flex
          flexDirection={'row'}
          justify={'space-evenly'}
          align={'center'}
          gap={'1'}
        >
          <Text
            whiteSpace={'nowrap'}
            fontSize="sm"
            lineHeight={'16px'}
            color="main"
          >
            Advanced settings
          </Text>
        </Flex>
        {isAdvancedSetOpen ? (
          <TriangleUpIcon color="main" h="10px" w="10px" />
        ) : (
          <TriangleDownIcon color="main" h="10px" w="10px" />
        )}
        <Divider />
      </Flex>

      {/* TODO this component changes width of the parent. See if this is okay, else fix it. */}
      {isAdvancedSetOpen ? (
        <Flex
          mt={'1rem'}
          px="4"
          lineHeight={'3rem'}
          justify={'start'}
          flexDirection={'column'}
          gap={'1rem'}
        >
          {/* TODO child Select options are not exactly like figma */}
          <Box>
            The quest is{' '}
            <Select
              rounded={'full'}
              variant="filled"
              w={'fit-content'}
              display={'inline-block'}
              value={
                questAdvSetting.optional === false ? 'required' : 'optional'
              }
              onChange={e =>
                setQuestAdvSetting(prevState => {
                  return {
                    ...prevState,
                    optional: e.target.value === 'required' ? false : true,
                  };
                })
              }
            >
              <option value="required">required</option>
              <option value="optional">optional</option>
            </Select>{' '}
            and submissions of proof will be reviewed{' '}
            <Select
              rounded={'full'}
              variant="filled"
              w={'fit-content'}
              display={'inline-block'}
              value={
                questAdvSetting.skipReview === false
                  ? 'reviewed_manually'
                  : 'auto_accepted'
              }
              onChange={e =>
                setQuestAdvSetting(prevState => {
                  return {
                    ...prevState,
                    skipReview:
                      e.target.value === 'reviewed_manually' ? false : true,
                  };
                })
              }
            >
              <option value="reviewed_manually">reviewed manually</option>
              <option value="auto_accepted">auto-accepted</option>
            </Select>
          </Box>
          <Divider />
          <Flex align={'center'} justify={'space-between'}>
            <FormLabel htmlFor="questDisabled" mb="0">
              Start quest as disabled
            </FormLabel>
            {/* TODO Not exactly like figma */}
            <Switch
              id="questDisabled"
              size="lg"
              isChecked={questAdvSetting.paused}
              onChange={e =>
                setQuestAdvSetting(prevState => {
                  return {
                    ...prevState,
                    paused: e.target.checked ? true : false,
                  };
                })
              }
            />
          </Flex>
          <Divider />
        </Flex>
      ) : null}
    </div>
  );
};

export default QuestAdvancedSettings;
