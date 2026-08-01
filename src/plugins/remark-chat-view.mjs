import { visit } from 'unist-util-visit';

const AVATARS = {
  タカシ: {
    base: '/avatars/takashi',
    defaultEmotion: 'normal',
    validEmotions: ['normal', 'surprise'],
  },
  センセイ: {
    base: '/avatars/sensei',
    defaultEmotion: 'normal',
    validEmotions: ['normal', 'smile'],
  },
};

export function remarkChatView() {
  const basePath = process.env.NODE_ENV === 'production' ? '/manga-dialogue-blog' : '';

  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'chat') return;

      const lines = node.value.split('\n').filter((l) => l.trim().length > 0);
      let htmlContent = '<div class="chat-container">';

      lines.forEach((line) => {
        const cleaned = line.trim().replace(/^\{\{/, '').replace(/\}\}$/, '');
        const parts = cleaned.split('|').map((p) => p.trim());

        if (parts.length < 2) return;

        const name = parts[0];
        let emotion = 'normal';
        let text = '';
        let time = '';

        const charConfig = AVATARS[name] || {
          base: '/avatars/default',
          defaultEmotion: 'normal',
          validEmotions: ['normal'],
        };

        if (parts.length === 4) {
          emotion = charConfig.validEmotions.includes(parts[1]) ? parts[1] : charConfig.defaultEmotion;
          text = parts[2];
          time = parts[3];
        } else if (parts.length === 3) {
          if (charConfig.validEmotions.includes(parts[1])) {
            emotion = parts[1];
            text = parts[2];
          } else {
            emotion = charConfig.defaultEmotion;
            text = parts[1];
            time = parts[2];
          }
        } else if (parts.length === 2) {
          emotion = charConfig.defaultEmotion;
          text = parts[1];
        }

        const isLeft = name === 'タカシ';
        const avatarUrl = `${basePath}${charConfig.base}_${emotion}.svg`;

        htmlContent += `
          <div class="chat-message ${isLeft ? 'left' : 'right'}">
            <div class="chat-avatar-wrapper">
              <img src="${avatarUrl}" alt="${name}" class="chat-avatar" />
              <span class="chat-name">${name}</span>
            </div>
            <div class="chat-content">
              <div class="chat-bubble">${text}</div>
              ${time ? `<span class="chat-time">${time}</span>` : ''}
            </div>
          </div>
        `;
      });

      htmlContent += '</div>';

      parent.children[index] = {
        type: 'html',
        value: htmlContent,
      };
    });
  };
}
