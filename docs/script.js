document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('madlibForm');
    const result = document.getElementById('result');
    const storyText = document.getElementById('storyText');
    const copyButton = document.getElementById('copyButton');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const adjective = document.getElementById('adjective').value;
        const noun = document.getElementById('noun').value;
        const verb = document.getElementById('verb').value;

        // Generate the story
        const story = `In the vast black of space, ${name} was ${verb} through the ${adjective} ${noun}. The crew of Serenity watched in amazement as the scene unfolded before their eyes.`;

        // Display the result
        storyText.textContent = story;
        result.classList.remove('hidden');
    });

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(storyText.textContent);
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text to clipboard');
        }
    });
}); 