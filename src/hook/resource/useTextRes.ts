import { useTranslation } from 'react-i18next';
import { ResourceEnum } from 'types/resource/ResourceEnum';

/**
 * text에 해당하는 resource 를 반환하는 hook 입니다.
 *
 * @param resourceId 찾고 싶은 label의 id
 * @returns id에 해당하는 resource 값
 */
function useTextRes(resourceId: Nullable<ResourceEnum>): string {
  const { t } = useTranslation();

  return resourceId ? t(resourceId) : '';
}

export default useTextRes;
