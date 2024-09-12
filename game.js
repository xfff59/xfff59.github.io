class TextGame {
    constructor(questionElementId, answerButtonsElementId, followupElementId, prevButtonContainerId) {
        this.questionElement = document.getElementById(questionElementId);
        this.answerButtonsElement = document.getElementById(answerButtonsElementId);
        this.followupElement = document.getElementById(followupElementId);
        this.prevButtonContainer = document.getElementById(prevButtonContainerId); // New container for prev button
        this.history = [];  // Stack to keep track of visited states
        this.states = {
            start: {
                text: "早上好小开心! 生日快乐🎉 今天起床感觉怎么样？",
                buttons: [
                    { text: "超级开心！", action: () => this.changeState('happy') },
                    { text: "还不错", action: () => this.changeState('happy') },
                    { text: "感觉像被打了一顿", action: () => this.nextStep('unhappy') }
                ]
            },
            happy: {
                text: "不错不错，所以今天打算去干什么？",
                buttons: [
                    { text: "庆祝一下", action: () => this.nextStep('celebrate') },
                    { text: "还没想好呢", action: () => this.changeState('wish') }
                ]
            },
            wish: {
                text: "闲着也是闲着，猜猜我给你准备了什么？",
                buttons: [
                    { text: "fxr这种拖延症显然什么都没准备", action: () => this.nextStep('procrast') },
                    { text: "一份惊喜！", action: () => this.changeState('gift') }
                ]
            },
            gift: {
                text: "鉴于你对我有这么高的期待，让我们来具像化一下你的要求。你最想要的是……",
                buttons: [
                    { text: "something sweet", action: () => this.displayFinalMessage() },
                    { text: "something helpful", action: () => this.nextStep('gift') }
                ]
            },
        };
        this.followUpMessages = {
            celebrate: "太好了，玩去吧",
            procrast: "你真是天才，你怎么知道我还没下单礼物",
            gift: "是这样的，我想买几本书送你，但是我发现我最近根本没有看书（别骂了）<br>所以你可以悄悄vx告诉我你想要什么方面的书吗",
            unhappy: "Sorry to hear that. Anything I can do to help?<br>哈哈，这么sweet显然是chatgpt生成的。我只会说我每天起床都像是被打了一顿",
        };
    }

    init() {
        this.changeState('start');
    }

    changeState(stateKey) {
        this.history.push(stateKey);  // Save state to history
        this.updateView(stateKey);
    }

    updateView(stateKey) {
        const state = this.states[stateKey];
        this.questionElement.textContent = state.text;
        this.answerButtonsElement.innerHTML = ''; // Clear previous buttons
        state.buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.className = 'btn btn-primary';
            btn.onclick = button.action;
            this.answerButtonsElement.appendChild(btn);
        });
        this.followupElement.innerHTML = ''; // Clear followup text
        this.showPreviousButton();
    }

    showPreviousButton() {
        if (this.history.length > 1) {  // Show only if there's a previous state to return to
            const btn = document.createElement('button');
            btn.textContent = 'Previous';
            btn.className = 'btn btn-primary';
            btn.onclick = this.goBack.bind(this);
            this.prevButtonContainer.innerHTML = '';  // Clear previous buttons
            this.prevButtonContainer.appendChild(btn);
        } else {
            this.prevButtonContainer.innerHTML = '';  // Ensure no button if not needed
        }
    }
    goBack() {
        if (this.history.length > 1) {  // Can't go back from the initial state
            this.history.pop();  // Remove current state
            const previousState = this.history.pop();  // Remove and return to the previous state
            this.changeState(previousState);
        }
    }

    nextStep(step) {
        this.followupElement.innerHTML = '<p class="lead">' + this.followUpMessages[step] + '</p>';
    }

    displayFinalMessage() {
        // Clear the existing content
        this.questionElement.innerHTML = '';
        this.answerButtonsElement.innerHTML = '';
        this.followupElement.innerHTML = '';
        this.prevButtonContainer.innerHTML = '';

        // Set up the new content
        const messageContainer = document.createElement('div');
        messageContainer.innerHTML = `
            <p class="lead">Thank you for your friendship and support. I wouldn't be the person I am today or have achieved what I have without you.</p>
            <p class="lead">The past six months have been incredibly joyful and meaningful for me, largely thanks to you. I'm really glad that we have both managed to overcome the obstacles that once held us back or made us suffer.</p>
            <p class="lead">You possess a strength and courage that I admire and aspire to. Your resilience often inspires me and offers new perspectives.</p>
            <p class="lead">为什么要用英文呢，因为本人保守且文盲，显然没法用中文流畅且不尴尬地表达这个意思。总之，生日快乐，祝你新的一年能上到很多大佬的舞蹈课，去很多的表演，拍出美美照片，以及有惊无险地度过很多段有趣的冒险。</p>            
            <p class="lead">Here's to many more years of friendship and fun. May your year ahead be filled with laughter, love, and exciting new adventures!</p>
        `;

        // Append the new content to the main container or a specific element
        document.body.appendChild(messageContainer); // You might want to append it to a more specific container
    }
}

const game = new TextGame('question', 'answer-buttons', 'followup', 'previous-button-container');
window.onload = () => game.init();