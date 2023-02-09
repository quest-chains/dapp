import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Collapse,
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
  isCreatingQuest?: boolean;
};

const QuestAdvancedSettings = ({
  questAdvSetting,
  setQuestAdvSetting,
  isCreatingQuest = false,
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
        my={3}
        cursor={'pointer'}
        onClick={() => setIsAdvancedSetOpen(prev => !prev)}
      >
        <Divider />
        <Flex
          flexDirection={'row'}
          justify={'space-evenly'}
          align={'center'}
          gap={'1'}
          cursor={'pointer'}
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

      <Collapse in={isAdvancedSetOpen} animateOpacity>
        <Flex
          lineHeight={'3rem'}
          justify={'start'}
          flexDirection={'column'}
          gap={4}
          pb={4}
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
              cursor="pointer"
              fontSize="sm"
            >
              <option value="required">required</option>
              <option value="optional">optional</option>
            </Select>{' '}
            and submissions of proof will be{' '}
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
              cursor="pointer"
              fontSize="sm"
            >
              <option value="reviewed_manually">reviewed manually</option>
              <option value="auto_accepted">auto-accepted</option>
            </Select>
          </Box>
          <Divider />
          <Flex align={'center'} justify="space-between">
            <FormLabel htmlFor="questDisabled" mb="0" fontWeight="normal">
              {isCreatingQuest ? 'Start' : 'Set'} quest as disabled
            </FormLabel>
            {/* TODO Not exactly like figma */}
            <Switch
              mr={2}
              size="lg"
              id="questDisabled"
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
      </Collapse>
    </div>
  );
};

export default QuestAdvancedSettings;
