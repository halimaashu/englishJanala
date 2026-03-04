const createElement = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};
//  speak tehe word
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpoiner = (status) => {
  if (status === true) {
    document.getElementById("loding").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("loding").classList.add("hidden");
  }
};

const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLesson(data));
};
const removeActive = () => {
  const active = document.querySelectorAll(".lesson-btn");
  // console.log(active);
  active.forEach((e) => e.classList.remove("active"));
};
const getLesson = (id) => {
  // console.log(id)
  manageSpoiner(true);
  let url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayWord(data);
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
    });
};

const displayLesson = (lessons) => {
  //  get container
  //   console.log(lessons)

  const container = document.getElementById("lession-conatainer");
  container.innerHTML = "";
  // for loop
  const lessonss = lessons.data;
  // console.log(lessonss)
  for (const lesson of lessonss) {
    // console.log(lesson)
    const buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}" onclick="getLesson(${lesson.level_no})" class="btn btn-outline btn-primary  lesson-btn"><i class="fa-solid fa-book-open"></i> lesson ${lesson.level_no}</button>
    `;

    container.append(buttonDiv);
  }
};

const loadWordDetail = async (id) => {
  let url = `https://openapi.programming-hero.com/api/word/${id}`;
  const data = await fetch(url);
  const details = await data.json();
  loadWordDetailDisplay(details.data);
};
const loadWordDetailDisplay = (details) => {
  console.log(details.word);
  const detailsContainer = document.getElementById("detail-container");
  detailsContainer.innerHTML = `
 <div class="space-y-2">
              <h1 class="font-bold text-4xl">${details.word} (<i class="fa-solid fa-microphone"></i> :${details.pronunciation})</h1>
              <h1 class="font-bold test-lg">Meaning</h1>
              <p class="banlgali">${details.meaning}</p>
              <h3>Example</h3>
              <p class="text-gray-500">${details.sentence}</p>
              <h2 class="bangali">সমার্থক শব্দ গুলো</h2>
              <div class="flex gap-3">
                 ${createElement(details.synonyms)}
              </div>
              <button class="btn btn-primary">Complete Learning</button>
            </div>
`;

  document.getElementById("word_modal").showModal();
};

const displayWord = (words) => {
  //get display sec
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  const getWord = words.data;

  if (getWord.length == 0) {
    wordContainer.innerHTML = `
   <div class="text-center col-span-full bangali space-y-5 p-10">
      <img class="text-center mx-auto" src="./assets/alert-error.png"/>
      <p class="text-[#79716B] text-2xl font-medium">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h1 class="text-[#292524] text-5xl font-bold">নেক্সট Lesson এ যান</h1>
     </div>
   `;
   manageSpoiner(false)
    return;
  }
  getWord.forEach((word) => {
    const div = document.createElement("div");
    div.innerHTML = `
     <div
        class="bg-white text-center py-10 px-5 rounded-md shadow-md space-y-4"
      >
        <h1 class="text-lg font-bold">${word.word ? word.word : "word not found"}</h1>
        <p class="font-semibold">mining/pronunciation</p>
        <div class="text-2xl bangali">"${word.meaning ? word.meaning : "meaning not found"}/${word.pronunciation ? word.pronunciation : "pronunciation not found"} "</div>
        <div class="flex justify-between items-center">
        <button  onclick="loadWordDetail(${word.id})" class="bg-sky-100 btn hover:bg-sky-400">
        <i class="fa-solid fa-circle-info"></i>
        </button>
        <button  onclick="pronounceWord('${word.word}')" class="bg-sky-100 btn hover:bg-sky-400">
        <i class="fa-solid fa-volume-low"></i>
        </button>
        </div>
      </div>
    `;
    wordContainer.append(div);
  });
    manageSpoiner(false);

};
loadLesson();


document.getElementById("search-btn").addEventListener("click",()=>{
 removeActive();
  const search=document.getElementById("input-search");
  const searchValue=search.value.trim().toLowerCase();
  console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
  .then((res)=>res.json())
  .then((data)=>{
    const allWords=data.data;
    const searchWords=allWords.filter((word)=>word.word.toLowerCase().includes(searchValue));
    
    displayWord({ data: searchWords });
    console.log(searchWords)
    // console.log(allWords)
  })
});
