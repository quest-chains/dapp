import { Page } from '@/components/Layout/Page';
import SearchQuestChains from '@/components/SearchQuestChains';
import { HeadComponent } from '@/components/Seo';
import { QUESTCHAINS_URL } from '@/utils/constants';

const Explore: React.FC = () => {
  return (
    <Page alignItems="flex-start" gap={4}>
      <HeadComponent
        title="Explore quest chains"
        description="Browse through the catalogue of quest chains"
        url={QUESTCHAINS_URL + '/explore'}
      />
      <SearchQuestChains />
    </Page>
  );
};

export default Explore;
