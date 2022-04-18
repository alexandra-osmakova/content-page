"use strict";

const textToInsert =
    '"Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don\'t tell me that this means war, if you still try to defend the infamies and horrors perpetrated by that Antichrist--I really believe he is Antichrist--I will have nothing more to do with you and you are no longer my friend, no longer my \'faithful slave,\' as you call yourself! But how do you do? I see I have frightened you--sit down and tell me all the news." It was in July, 1805, and the speaker was the well-known Anna Pavlovna Scherer, maid of honor and favorite of the Empress Marya Fedorovna. With these words she greeted Prince Vasili Kuragin, a man of high rank and importance, who was the first to arrive at her reception. Anna Pavlovna had had a cough for some days. She was, as she said, suffering from la grippe; grippe being then a new word in St. Petersburg, used only by the elite.All her invitations without exception, written in French, and delivered by a scarlet-liveried footman that morning, ran as follows: "If you have nothing better to do, Count [or Prince], and if the prospect of spending an evening with a poor invalid is not too terrible, I shall be very charmed to see you tonight between 7 and 10--Annette Scherer." "Heavens! what a virulent attack!" replied the prince, not in the least disconcerted by this reception. He had just entered, wearing an embroidered court uniform, knee breeches, and shoes, and had stars on his breast and a serene expression on his flat face. He spoke in that refined French in which our grandfathers not only spoke but thought, and with the gentle, patronizing intonation natural to a man of importance who had grown old in society and at court. He went up to Anna Pavlovna, kissed her hand, presenting to her his bald, scented, and shining head, and complacently seated himself on the sofa. "First of all, dear friend, tell me how you are. Set your friend\'s mind at rest," said he without altering his tone, beneath the politeness and affected sympathy of which indifference and even irony could be discerned. "Can one be well while suffering morally? Can one be calm in times like these if one has any feeling?" said Anna Pavlovna. "You are staying the whole evening, I hope?" "And the fete at the English ambassador\'s? Today is Wednesday. I must put in an appearance there," said the prince. "My daughter is coming for me to take me there." "I thought today\'s fete had been canceled. I confess all these festivities and fireworks are becoming wearisome." "If they had known that you wished it, the entertainment would have been put off," said the prince, who, like a wound-up clock, by force of habit said things he did not even wish to be believed. "Don\'t tease! Well, and what has been decided about Novosiltsev\'s dispatch? You know everything." "What can one say about it?" replied the prince in a cold, listless tone. "What has been decided? They have decided that Buonaparte has burnt his boats, and I believe that we are ready to burn ours." Prince Vasili always spoke languidly, like an actor repeating a stale part. Anna Pavlovna Scherer on the contrary, despite her forty years, overflowed with animation and impulsiveness. To be an enthusiast had become her social vocation and, sometimes even when she did not feel like it, she became enthusiastic in order not to disappoint the expectations of those who knew her. The subdued smile which, though it did not suit her faded features, always played round her lips expressed, as in a spoiled child, a continual consciousness of her charming defect, which she neither wished, nor could, nor considered it necessary, to correct. In the midst of a conversation on political matters Anna Pavlovna burst out: "Oh, don\'t speak to me of Austria. Perhaps I don\'t understand things, but Austria never has wished, and does not wish, for war. She is betraying us! Russia alone must save Europe. Our gracious sovereign recognizes his high vocation and will be true to it. That is the one thing I have faith in! Our good and wonderful sovereign has to perform the noblest role on earth, and he is so virtuous and noble that God will not forsake him. He will fulfill his vocation and crush the hydra of revolution, which has become more terrible than ever in the person of this murderer and villain! We alone must avenge the blood of the just one.... Whom, I ask you, can we rely on?... England with her commercial spirit will not and cannot understand the Emperor Alexander\'s loftiness of soul. She has refused to evacuate Malta. She wanted to find, and still seeks, some secret motive in our actions. What answer did Novosiltsev get? None. The English have not understood and cannot understand the self-abnegation of our Emperor who wants nothing for himself, but only desires the good of mankind. And what have they promised? Nothing! And what little they have promised they will not perform! Prussia has always declared that Buonaparte is invincible, and that all Europe is powerless before him.... And I don\'t believe a word that Hardenburg says, or Haugwitz either. This famous Prussian neutrality is just a trap. I have faith only in God and the lofty destiny of our adored monarch. He will save Europe!"';

const lengthInput = document.getElementById("length");
const limitInput = document.getElementById("limit");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loader");
const progressStart = document.getElementById("progressStart");
const loaderEnd = document.getElementById("progressEnd");
const content = document.getElementById("content");
const btnMenu = document.getElementById("btn-menu");

window.addEventListener("scroll", () => {
    if (btnMenu.checked) {
        btnMenu.checked = false;
    }
});

document.getElementById("searchForm").onsubmit = async (e) => {
    e.preventDefault();

    const lengthValue = lengthInput.value;
    const limitValue = limitInput.value;

    const contentToInsert = getContentToInsert(lengthValue);
    const mapper = (content) =>
        new Promise((resolve) => {
            setTimeout(
                () => resolve(content),
                Math.round(Math.random() * 9000) + 1000
            );
        });

    if (content.children.length !== 0) {
        content.replaceChildren();
    }

    updatePageState(true);
    updateLoaderState(lengthValue);

    await queue(contentToInsert, mapper, limitValue);

    updatePageState(false);
};

const queue = async (arr, callback, limit) => {
    let left = [...arr];
    const result = new Map();
    const contentNodesList = new Map();

    const runRace = async () => {
        const payloadObjects = left.slice(0, limit);
        const payloadPromises = payloadObjects.map((o) => {
            if (result.has(o)) {
                return result.get(o);
            } else {
                const objCallback = callback(o);

                const article = generateContentItem(o);
                contentNodesList.set(o, article);
                content.append(article);

                result.set(o, objCallback);

                return objCallback;
            }
        });

        const ready = await Promise.any(payloadPromises);

        updateProgress();
        addArticleText(contentNodesList.get(ready), ready?.text);

        left = left.filter((o) => o !== ready);

        if (left.length > 0) {
            await runRace();
        }
    };

    await runRace();

    return result.values();
};

const generateContentItem = (contentToInsert) => {
    const article = document.createElement("article");
    article.classList.add("article");

    article.append(getArticleTitle(contentToInsert.title), getPreloader());

    return article;
};

const getArticleTitle = (titleText) => {
    const articleTitle = document.createElement("div");
    const title = document.createElement("h5");

    articleTitle.classList.add("article-title");
    title.innerText = titleText;

    articleTitle.append(title);

    return articleTitle;
};

const getPreloader = () => {
    const preloader = document.createElement("div");

    preloader.classList.add("preloader");

    for (let index = 0; index < 3; index++) {
        preloader.append(generatePreloaderItem());
    }

    return preloader;
};

const generatePreloaderItem = () => {
    const preloaderItem = document.createElement("div");
    preloaderItem.classList.add("preloader-item");

    return preloaderItem;
};

const addArticleText = (contentNode, text) => {
    const preloader = contentNode.lastChild;
    contentNode.removeChild(preloader);

    const articleText = document.createElement("p");
    articleText.innerText = text;
    contentNode.append(articleText);
};

const updateProgress = () => {
    progressStart.innerText = Number(progressStart.innerText) + 1;
};

const updateLoaderState = (maxValue) => {
    progressStart.innerText = 1;
    loaderEnd.innerText = maxValue;
};

const updatePageState = (isDisabled) => {
    if (!isDisabled) {
        lengthInput.value = null;
        limitInput.value = null;
    }
    lengthInput.disabled = isDisabled;
    limitInput.disabled = isDisabled;
    submitBtn.disabled = isDisabled;
    loader.hidden = !isDisabled;
};

const getContentToInsert = (contentLength) => {
    const availableContent = getSentenceList();
    const currentContent = [];

    let contentCounter = 0;

    for (let index = 0; index < contentLength; index++) {
        contentCounter =
            contentCounter > availableContent.length - 1 ? 0 : contentCounter;
        currentContent.push({
            title: `${index + 1}. ${getRandomTitle()}`,
            text: availableContent[contentCounter].trim(),
        });
        contentCounter = contentCounter + 1;
    }

    return currentContent;
};

const getSentenceList = () => {
    return textToInsert.replace(/\"/gi, "").match(/[^\.!\?]+[\.!\?]+/g);
};

const getRandomTitle = () => {
    const max = 200;
    const min = 10;
    const currentTitleLength =
        Math.floor(Math.random() * (max - min + 1)) + min;
    let currentTitle = "";

    for (let index = 0; index < currentTitleLength; index++) {
        currentTitle = currentTitle + generateRandomLetter();
    }

    return currentTitle.trim();
};

const generateRandomLetter = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz ";

    return alphabet[Math.floor(Math.random() * alphabet.length)];
};
