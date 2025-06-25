import type { IMessage } from '@rocket.chat/core-typings';
import type { Options, Root } from '@rocket.chat/message-parser';
import { useMemo } from 'react';

import { useAutoLinkDomains } from './useAutoLinkDomains';
import { useAutoLinkSchemes } from './useAutoLinkSchemes';
import { useMessageListAutoTranslate } from '../../../../components/message/list/MessageListContext';
import { parseMessageTextToAstMarkdown } from '../../../../lib/parseMessageTextToAstMarkdown';

export const useMessageBody = (message: IMessage | undefined): string | Root => {
        const autoTranslateOptions = useMessageListAutoTranslate();
        const customDomains = useAutoLinkDomains();
       const customSchemes = useAutoLinkSchemes();

	return useMemo(() => {
		if (!message) {
			return '';
		}

		if (message.md) {
                       const parseOptions: Options = {
                               customDomains,
                               emoticons: true,
                               ...(customSchemes.length && {
                                       supportSchemesForLink: ['http', 'https', ...customSchemes].join(','),
                               }),
                       };

			const messageWithMd = parseMessageTextToAstMarkdown(message, parseOptions, autoTranslateOptions);

			return messageWithMd.md;
		}

		if (message.msg) {
			return message.msg;
		}

		if (message.attachments) {
			const attachment = message.attachments.find((attachment) => attachment.title || attachment.description);

			if (attachment?.description) {
				return attachment.description;
			}

			if (attachment?.title) {
				return attachment.title;
			}
		}

		return '';
       }, [message, customDomains, customSchemes, autoTranslateOptions]);
};
