import { useSetting } from '@rocket.chat/ui-contexts';
import { useMemo } from 'react';

export const useAutoLinkSchemes = (): string[] => {
    const schemesSetting = useSetting<string>('Message_CustomScheme_AutoLink');

    const customSchemes = useMemo(() => (schemesSetting ? schemesSetting.split(',').map((scheme) => scheme.trim()) : []), [schemesSetting]);

    return useMemo(() => {
        return customSchemes;
    }, [customSchemes]);
};
