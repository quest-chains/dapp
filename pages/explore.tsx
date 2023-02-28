import { Featured } from '@/components/Explore/Featured';
import QuestChains from '@/components/Explore/QuestChains';
import { Page } from '@/components/Layout/Page';
import { HeadComponent } from '@/components/Seo';
import { QUESTCHAINS_URL } from '@/utils/constants';

const Explore: React.FC = () => {
  return (
    <Page alignItems="flex-start" gap={4} flex={1}>
      <HeadComponent
        title="Explore quest chains"
        description="Browse through the catalogue of quest chains"
        url={QUESTCHAINS_URL + '/explore'}
      />
      <Featured />
      <QuestChains />
    </Page>
  );
};

export default Explore;
