import { Page, Main, Header, Collapse } from '@flumens';
import personTakingPhoto from 'common/images/personTakingPhoto.jpg';
import transectWShape from 'common/images/transectWShape.jpg';
import { INTRO_VIDEO, MOTH_VIDEOS } from 'common/videos';
import VideoGroup from './VideoGroup';
import flowers from './flowers.jpg';
import pollinatorsTable from './pollinators.png';
import './styles.scss';
import supportedGroupsTable from './supportedGroups.png';

const Help = () => (
  <Page id="help">
    <Header title="Help" />
    <Main>
      <div className="list m-3 [&_.text-sm]:leading-relaxed">
        <div className="rounded-list mt-3">
          <div className="list-divider">Getting started</div>
          <Collapse title="What can I do with e-Surveyor?">
            <div className="w-full py-2 text-sm">
              <p>
                e-Surveyor helps you find out what wildlife your land supports,
                and see how it changes over time. It covers three areas:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <b>Habitat:</b> your habitat types and the plants growing
                  there.
                </li>
                <li>
                  <b>Ecosystem Function:</b> the moths and ground beetles your
                  land supports. Day-time pollinators are coming soon.
                </li>
                <li>
                  <b>Soil:</b> coming soon.
                </li>
              </ul>
              <p>
                Watch the short videos at the bottom of this page to get
                started, or see <b>Menu &gt; About</b> for more.
              </p>
            </div>
          </Collapse>
          <Collapse title="Sign in/out or register">
            <div className="w-full py-2 text-sm">
              <p>
                To login, open the main menu page click Login or Register
                buttons and follow the instructions.
              </p>
              <p>
                To logout, visit the main menu page and click the logout button.
              </p>
              <p>
                <b>Note:</b> after registering a new account you must verify
                your email address by clicking on a verification link sent to
                your email.
              </p>
            </div>
          </Collapse>
          <Collapse title="What is a site, and why do I need one?">
            <div className="w-full py-2 text-sm">
              <p>
                A site is a place you survey, such as a field, margin or meadow.
                Every survey is linked to a site, so you can see how it changes
                from one visit or year to the next.
              </p>
              <p>
                To add a site, go to <b>Home &gt; Habitat &gt; My Sites</b>, or
                tap <b>Add a new site</b> when you start any survey. You'll be
                asked for:
              </p>
              <ol className="list-decimal pl-5">
                <li>
                  <b>Location:</b> where the site is.
                </li>
                <li>
                  <b>Site details:</b> its size and what's been happening there
                  recently. Farm and crop details are optional.
                </li>
                <li>
                  <b>Habitat type:</b> photos of the site, which the app uses to
                  suggest its habitat type.
                </li>
                <li>
                  <b>Summary:</b> check everything, then save.
                </li>
              </ol>
            </div>
          </Collapse>
          <Collapse title="How do I record changes to my site?">
            <div className="w-full py-2 text-sm">
              <p>
                Open the site from <b>My Sites</b>. There are two options:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <b>Edit site details</b> corrects a mistake. It changes the
                  current details.
                </li>
                <li>
                  <b>Update site information</b> records a real change, such as
                  new management or a different habitat. It's saved as a new
                  dated entry and the old details are kept, so you can track
                  change over time.
                </li>
              </ul>
            </div>
          </Collapse>
          <Collapse title="When is the best time to survey?">
            <div className="w-full py-2 text-sm">
              <p>
                Each survey has its own season. The <b>Calendar</b> tab at the
                bottom of the screen shows what suits this month, and when each
                survey can be done and when is best.
              </p>
              <p>
                Repeat surveys at the same time each year, so you're comparing
                like with like.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Habitat surveys</div>
          <Collapse title="Free Sampling or Structured Sampling: which should I do?">
            <div className="w-full py-2 text-sm">
              <p>
                <b>Free Sampling</b> is the quickest. Walk around your site and
                record the plants you find.
              </p>
              <p>
                <b>Structured Sampling</b> follows a set method: you stop at a
                number of quadrats along a route and record the plants in each
                one. Because it's a standard method, your results are easier to
                compare with other sites, "ideal habitats", or from one year to
                the next.
              </p>
            </div>
          </Collapse>
          <Collapse title="How to complete a Free Sampling survey">
            <div className="w-full py-2 text-sm">
              <ol className="list-decimal pl-5">
                <li>Choose your site (or add a new one).</li>
                <li>
                  If you sowed a seed mix, choose your seed supplier and then
                  the name of your mix. The app will compare the plants you
                  sowed with the plants you find.
                </li>
                <li>
                  Tap the green <b>Plant Species</b> button and take a photo of
                  a plant for the AI to identify. If you already know the plant,
                  hold the button down and type its name.
                </li>
                <li>
                  If the AI isn't sure, it shows{' '}
                  <span className="font-bold text-amber-600">?</span> or{' '}
                  <span className="font-bold text-red-600">&#10007;</span> next
                  to the plant. Tap it to see possible species and choose{' '}
                  <b>This is my plant</b>, or tap{' '}
                  <b>None of these? Search species</b>.
                </li>
                <li>
                  Keep going until you've recorded all your plants, then tap{' '}
                  <b>Finish</b>. Your survey uploads, then your report opens.
                </li>
              </ol>
              <p>
                Plants that can't be identified can still be uploaded with their
                photo for experts to check.
              </p>
            </div>
          </Collapse>
          <Collapse title="How to set up a Structured Sampling survey">
            <div className="w-full py-2 text-sm">
              <p>
                Choose your site (or add a new one), then the type of survey.
                This can be a survey with an existing method, or a "custom"
                survey where you choose how many quadrats you'll do and what
                size they are.
              </p>
              <p>
                For an existing method, choose the habitat type that best
                matches your site. Your results are compared with it. If you
                sowed a seed mix, you can add that too.
              </p>
              <p>
                Plan a route that covers all the different features of your
                site, such as a W shape:
              </p>
              <img
                src={transectWShape}
                alt="Suggested W-shaped transect route"
                className="mx-auto block max-w-full rounded-md"
              />
              <p>
                <b>Tip:</b> turn on <b>Shorter Common Standards</b> in{' '}
                <b>Menu &gt; App</b> to use 10 quadrats instead of 20 for a
                Common Standards survey.
              </p>
            </div>
          </Collapse>
          <Collapse title="How to complete a Structured Sampling survey">
            <div className="w-full py-2 text-sm">
              <img
                src={personTakingPhoto}
                alt="Photographing plants in a quadrat"
                className="mx-auto block max-w-full rounded-md"
              />
              <p>For each quadrat:</p>
              <ol className="list-decimal pl-5">
                <li>
                  Place your quadrat (or measure out the area) and open the
                  quadrat in the app.
                </li>
                <li>Take a photo of the whole quadrat.</li>
                <li>
                  Save the <b>Quadrat Location</b>. This lets you put the
                  quadrat back in the same spot on your next visit.
                </li>
                <li>
                  Record every plant inside it, the same way as Free Sampling.
                  If there are none, tap <b>No plants in this quadrat</b>.
                </li>
              </ol>
              <p>
                The quadrat list shows your progress: white = not started,
                orange = unfinished, green = complete. When they're all done,
                tap <b>Finish</b> to upload and see your report.
              </p>
            </div>
          </Collapse>
          <Collapse title="What distance should I walk between quadrats?">
            <div className="w-full py-2 text-sm">
              <img
                src={transectWShape}
                alt="Suggested W-shaped transect route"
                className="mx-auto block max-w-full rounded-md"
              />
              <p>
                The distance you walk between each quadrat depends on the area
                of habitat you are surveying. You should try to walk an even
                distance between each quadrat, and plan your route so that you
                are stopping in areas with different features (such as a ridge,
                or a tree creating shade).
              </p>
            </div>
          </Collapse>
          <Collapse title="What does my plant report mean?">
            <div className="w-full py-2 text-sm">
              <p>
                <b>Seed Mix</b> tells you how many of the plant species you
                sowed appeared in your survey. Tap it to see which are missing.
              </p>
              <p>
                <b>Insects</b> tells you how many insect species your plants
                could support. Tap it for the full list.
              </p>
              <p>
                <b>Potential pollinator count</b> shows how many pollinating
                species each of your plants supports. More species is generally
                better: it makes your pollinator community more stable, and can
                increase the productivity of your crop. Tap the green number to
                find out more.
              </p>
              <img
                src={pollinatorsTable}
                alt="Potential pollinator counts in a plant report"
                className="mx-auto block max-w-full rounded-md"
              />
              <p>
                <b>Potentially supported species</b> shows how many species in
                each insect group you're supporting. Supporting lots of groups
                means a wider range of benefits, such as pollination and natural
                pest control. Tap a group to find out more.
              </p>
              <img
                src={supportedGroupsTable}
                alt="Insect groups supported by the recorded plants"
                className="mx-auto block max-w-full rounded-md"
              />
              <p>
                <b>Structured Sampling</b> reports also compare your plants with
                a list of species that show good (<b>Positive</b>) or poorer (
                <b>Negative</b>) quality habitat. The fraction next to each
                species shows how many quadrats it was found in: 3/20 means 3 of
                your 20 quadrats. As a guide:
              </p>
              <ul className="list-disc pl-5">
                <li>20% of quadrats or fewer: rare</li>
                <li>21% to 40%: occasional</li>
                <li>41% to 60%: frequent</li>
                <li>More than 60%: very frequent</li>
              </ul>
            </div>
          </Collapse>
          <Collapse title="How do I improve my score?">
            <div className="w-full py-2 text-sm">
              <img
                src={flowers}
                alt="A variety of flowers for pollinators"
                className="mx-auto block max-w-full rounded-md"
              />
              <p>
                The survey results are based on the plants that insects are
                attracted to. To improve your score, use pollinator friendly
                seed mixes.
              </p>
              <p>
                If you are looking to choose your own species, try to select
                plants with flowers that are a variety of shapes and colours, as
                this will support a wider variety of insects.
              </p>
            </div>
          </Collapse>
          <Collapse title="What habitat type is my site?">
            <div className="w-full py-2 text-sm">
              <p>
                When you add a site in <b>My Sites</b>, the photos you take of
                it are used by AI-HAB, an AI tool from UKCEH, to suggest its
                habitat type (for example, neutral grassland). Check the
                suggestion and change it if it isn't right.
              </p>
              <p>
                If the habitat changes, use <b>Update site information</b> so
                the change is dated and kept in your site's history.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I do a Habitat Structure survey?">
            <div className="w-full py-2 text-sm">
              <p>
                Choose your site, take 1 to 3 photos of the whole site, then
                walk around it and answer for the site as a whole:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <b>Vegetation:</b> typical height, how much is short, how
                  varied it is, tussocks and layers.
                </li>
                <li>
                  <b>Ground and scrub:</b> slide to how much of the site is bare
                  ground, litter, poaching and scrub.
                </li>
                <li>
                  <b>Features:</b> add hedges, trees, ponds, dead wood and so
                  on, each with a photo and location.
                </li>
              </ul>
              <p>
                Do it once a year, at the same time of year, so you can see
                what's changed.
              </p>
            </div>
          </Collapse>
          <Collapse title="What are 'Additional observations' on a species?">
            <div className="w-full py-2 text-sm">
              <p>
                In Structured Sampling, once a species is identified you can add
                optional extra detail for its group: for example flowering
                stages for wildflowers, life stage for trees, or what a lichen
                is growing on. It's optional: skip it if you're short of time.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Moths</div>
          <Collapse title="How do I set up a moth survey?">
            <div className="w-full py-2 text-sm">
              <p>
                Choose your site, then how many traps you're using. Each trap
                has its own:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <b>Trap site photo</b>
                </li>
                <li>
                  <b>Trap Location</b>, so you can use the same spot next time
                </li>
                <li>
                  <b>Date:</b> this starts as the previous evening, as traps run
                  overnight
                </li>
                <li>
                  <b>Comment</b> (optional)
                </li>
              </ul>
              <p>
                New to moth trapping? Watch the four moth videos at the bottom
                of this page. <b>Navigational tips</b> in the survey shows you
                around the screens.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I record my moths?">
            <div className="w-full py-2 text-sm">
              <p>
                In the morning, open each trap in the app and photograph each
                moth. The AI suggests a name and how sure it is:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <b>Green (70% or more):</b> likely
                </li>
                <li>
                  <b>Amber (50% to 69%):</b> possible
                </li>
                <li>
                  <b>Under 50%:</b> saved as <b>Unidentified</b>
                </li>
              </ul>
              <p>
                Set the count if you have more than one of the same moth. Tap a
                photo to see it full size. If a trap is empty, tap{' '}
                <b>No moths caught</b>: an empty trap is a real result.
              </p>
            </div>
          </Collapse>
          <Collapse title="What if the app can't identify my moth?">
            <div className="w-full py-2 text-sm">
              <p>
                If you know what it is, tap the moth and choose from the AI's
                suggestions or search for the species.
              </p>
              <p>
                If you're not sure, tap <b>Leave for verifiers</b>. The moth
                stays Unidentified with its photo, and experts check it after
                you upload. You can still finish and upload your survey.
              </p>
            </div>
          </Collapse>
          <Collapse title="What does my moth report mean?">
            <div className="w-full py-2 text-sm">
              <p>
                Your report opens once your survey has uploaded. It shows how
                many moths and species you recorded. For each species you'll
                see:
              </p>
              <ul className="list-disc pl-5">
                <li>how many you caught</li>
                <li>how common it is in your area</li>
                <li>
                  its GB status: whether it's increasing or decreasing
                  nationally
                </li>
                <li>
                  whether it's new to the app, new this year or new to your site
                </li>
                <li>
                  the plants its caterpillars feed on, and the habitats it uses
                </li>
                <li>a link to UKMoths to find out more</li>
              </ul>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Ground beetles</div>
          <Collapse title="How do I set up pitfall traps?">
            <div className="w-full py-2 text-sm">
              <p>
                We recommend 3 pitfall traps per site. Watch the trap setup
                video on the <b>Ground beetles</b> card first.
              </p>
              <p>
                Choose your site, then the number of traps. Each trap has its
                own photo, <b>Trap Location</b>, <b>Position</b>,{' '}
                <b>Date put out</b> and <b>Trapping period</b> (days).
              </p>
              <p>
                When you collect the traps, record whether each one was
                disturbed (for example flooded or dug up) and, if you like, the
                weather while it was out.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I record my beetles?">
            <div className="w-full py-2 text-sm">
              <p>
                Photograph each beetle on its own: every beetle is its own
                record. For each one, choose its size:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <b>Small:</b> under 5 mm
                </li>
                <li>
                  <b>Medium:</b> 5 to 10 mm
                </li>
                <li>
                  <b>Large:</b> over 10 mm
                </li>
              </ul>
              <p>
                If you photographed something that isn't a ground beetle, tap{' '}
                <b>This is not a beetle</b> and it's left out of your results.
                If a trap is empty, tap <b>No beetles caught</b>.
              </p>
            </div>
          </Collapse>
          <Collapse title="What if the app can't identify my beetle?">
            <div className="w-full py-2 text-sm">
              <p>
                It works the same as moths. Beetles the AI is less than 50% sure
                about are saved as Unidentified. Identify it yourself if you
                can, or tap <b>Leave for verifiers</b>.
              </p>
              <p>
                After you upload, the Ground Beetle Recording Scheme checks your
                records on iRecord.
              </p>
            </div>
          </Collapse>
          <Collapse title="What does my beetle report mean?">
            <div className="w-full py-2 text-sm">
              <p>
                Your report opens once your survey has uploaded. It shows how
                many beetles and species you caught, and for each species: how
                many, their sizes, what they eat, when they're active, and which
                traps they were in.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Day-time pollinators</div>
          <Collapse title="What is a FIT Count?">
            <div className="w-full py-2 text-sm">
              <p>
                A Flower-Insect Timed Count, from the UK Pollinator Monitoring
                Scheme. You watch a 50 x 50 cm patch of one kind of flower for 5
                or 10 minutes and count the insects that land on it, by group
                (bumblebees, hoverflies and so on). You don't need to identify
                species.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I do a FIT Count?">
            <div className="w-full py-2 text-sm">
              <ol className="list-decimal pl-5">
                <li>
                  Choose your site and find a patch with plenty of one kind of
                  flower.
                </li>
                <li>
                  Count the flowers in the patch and note the sunshine and wind.
                </li>
                <li>Choose 5 or 10 minutes and start the timer.</li>
                <li>
                  Tap a group each time an insect lands on a flower in the
                  patch.
                </li>
                <li>
                  Tap <b>Finish</b> to upload and see your report.
                </li>
              </ol>
              <p>Warm, dry, sunny days with little wind are best.</p>
            </div>
          </Collapse>
          <Collapse title="What if I have to stop early?">
            <div className="w-full py-2 text-sm">
              <p>
                Tap <b>End the count early</b>. The time you actually counted is
                saved, and you can still upload it. Your results are scaled to
                10 minutes so they can be compared with full counts.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3 hidden">
          <div className="list-divider">Soil</div>
          <Collapse title="Which soil check should I choose?">
            <div className="w-full py-2 text-sm">
              <ul className="list-disc pl-5">
                <li>
                  <b>Full Soil Health Check:</b> all three tests at the same
                  points (you can untick any).
                </li>
                <li>
                  <b>Soil Structure Check:</b> how compacted and well-structured
                  your soil is.
                </li>
                <li>
                  <b>Soil Life Check:</b> earthworms and other soil creatures.
                </li>
                <li>
                  <b>Lab Samples</b> then <b>Lab Results:</b> organic matter and
                  nutrients, measured by a lab.
                </li>
              </ul>
              <p>
                You can take as many or as few sample points as you need, and
                they're saved so you can go back to the same spots.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I score soil structure?">
            <div className="w-full py-2 text-sm">
              <p>
                Dig out a spadeful, break it apart gently and compare it with
                the pictures in the guide. Sq1 is crumbly and good; Sq5 is
                solid, compact blocks. Then push the penetrometer in and note
                the depth where it gets hard.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I count earthworms?">
            <div className="w-full py-2 text-sm">
              <p>
                Dig a block 20 x 20 x 20 cm, sort through it on a tray and count
                adults (with a saddle) and young worms. Photograph them on the
                tray, not touching, so the AI can identify them. Note any other
                creatures you see.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I add lab results?">
            <div className="w-full py-2 text-sm">
              <p>
                Use <b>Lab Results</b> on the Soil page. Pick the samples you
                took, upload the lab's report, then for each sample choose its
                status and enter the results. If a sample was inconclusive or
                failed, mark it, and take a new sample at that point if you need
                to. You can add or remove samples so the list matches what the
                lab sent back.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Identifying species</div>
          <Collapse title="Why is the AI not certain what my species is?">
            <div className="w-full py-2 text-sm">
              <p>
                There are some common reasons why the AI might be uncertain.
                Perhaps the plant or animal is small in your photo, blurry, or
                one of several species in the photo. Sometimes features needed
                for identification are missing from the image. If the species is
                very rare, the AI may not have been trained to identify it.
              </p>
              <p>
                Rather than give a wrong answer, the AI tells you how confident
                it is, so you can decide whether to accept its suggestion.
              </p>
            </div>
          </Collapse>
          <Collapse title="What should I do if I think that the AI has picked the wrong species?">
            <div className="w-full py-2 text-sm">
              <p>
                Tap the identification to see a list of similar species. If one
                is a better fit, choose it (for plants, tap{' '}
                <b>This is my plant</b>). If none fit, tap{' '}
                <b>None of these? Search species</b> and choose the right name.
              </p>
              <p>
                If you know a plant before you take its photo, hold down the
                green <b>Plant Species</b> button to type its name.
              </p>
            </div>
          </Collapse>
          <Collapse title="5 tips for an AI-friendly image">
            <div className="w-full py-2 text-sm">
              <ol className="list-decimal pl-5">
                <li>
                  Make sure that one part of your species (such as a flower or a
                  leaf) is in the centre of the image.
                </li>
                <li>
                  Try to avoid a busy background, particularly one with a lot of
                  other species in it.
                </li>
                <li>
                  Focus the image by tapping on the part of your species you
                  want to take a photo of, and then slowly zoom in, refocusing
                  as you go.
                </li>
                <li>
                  Check that nothing is between the species and the camera, such
                  as an insect or your finger.
                </li>
                <li>
                  If the AI is uncertain about the species you can add more
                  photos from different angles or of different parts of your
                  species to help improve identification.
                </li>
              </ol>
            </div>
          </Collapse>
          <Collapse title="Can I identify something without doing a survey?">
            <div className="w-full py-2 text-sm">
              <p>
                Yes. On the Home page, use <b>Identify plant</b>,{' '}
                <b>Identify habitat</b>, <b>Identify moth</b> or{' '}
                <b>Identify carabid</b>. Take a photo and the AI suggests what
                it is. Nothing is saved to a survey.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Surveys &amp; Results</div>
          <Collapse title="How do I upload my surveys?">
            <div className="w-full py-2 text-sm">
              <p>
                When you've finished, tap <b>Finish</b>. The app checks nothing
                is missing (for example, every trap needs a location and date),
                asks you to confirm, then uploads your survey and shows your
                report.
              </p>
              <p>
                Surveys waiting to upload are in{' '}
                <b>Surveys &amp; Results &gt; Surveys &gt; Pending</b>. The app
                keeps trying until it has a good connection.
              </p>
              <p>
                <b>Note:</b> you have to be signed in and have a network
                connection to upload. To save mobile data, turn on{' '}
                <b>Use Wi-Fi to upload images</b> in <b>Menu &gt; App</b>.
              </p>
            </div>
          </Collapse>
          <Collapse title="Can I complete a survey without phone signal?">
            <div className="w-full py-2 text-sm">
              <p>
                Yes. The AI can't identify species until you're back in range,
                but you can still take photos and record everything. If you know
                a plant, hold down the green <b>Plant Species</b> button to type
                its name.
              </p>
              <p>
                With <b>Identify when reconnected</b> turned on (
                <b>Menu &gt; App</b>; it's on to start with), the app identifies
                your photos in the background once you have signal again. Wait
                until they've been identified before you tap <b>Finish</b>.
              </p>
            </div>
          </Collapse>
          <Collapse title="What do my Results show?">
            <div className="w-full py-2 text-sm">
              <p>
                <b>Surveys &amp; Results &gt; Results</b> shows everything from
                the surveys you've uploaded. Choose a site and year at the top.
                You'll see how much surveying you've done, then a dashboard for
                each area: <b>Habitat</b>, <b>Ecosystem Function</b> and{' '}
                <b>Soil</b>. Tap a section to open it.
              </p>
              <p>Surveys that haven't uploaded yet aren't included.</p>
            </div>
          </Collapse>
          <Collapse title="What does 'verified' mean?">
            <div className="w-full py-2 text-sm">
              <p>
                After you upload, experts check records. The bar at the top of
                each dashboard shows how many of your records are{' '}
                <b>verified</b> (checked and confirmed), <b>not yet verified</b>
                , and unidentified ones waiting for experts to name them.
              </p>
            </div>
          </Collapse>
          <Collapse title="Delete a survey">
            <div className="w-full py-2 text-sm">
              <p>
                To delete a survey, go to{' '}
                <b>Surveys &amp; Results &gt; Surveys</b>, swipe it left and tap
                the delete button.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Other</div>
          <Collapse title="How is my data used and shared?">
            <div className="w-full py-2 text-sm">
              <p>
                Your surveys are saved to UKCEH's e-Surveyor database so you can
                see your results here and on the website, and UKCEH uses them
                for research. Anything else is your choice: for example sharing
                species records with national recording, or showing your name.
                Change your choices at any time in{' '}
                <b>Menu &gt; App &gt; Data sharing</b>.
              </p>
            </div>
          </Collapse>
          <Collapse title="What is Training Mode?">
            <div className="w-full py-2 text-sm">
              <p>
                Turn on <b>Training Mode</b> in <b>Menu &gt; App</b> when you're
                practising, for example on a training day. Any new records are
                marked as 'training' and left out of all reports. Remember to
                turn it off afterwards.
              </p>
            </div>
          </Collapse>
          <Collapse title="Reset the application">
            <div className="w-full py-2 text-sm">
              <p>
                Go to <b>Menu &gt; App</b> and tap <b>Reset app</b>.
              </p>
            </div>
          </Collapse>
        </div>

        <div className="rounded-list mt-3">
          <div className="list-divider">Videos</div>
          <VideoGroup title="Getting started" videos={[INTRO_VIDEO]} />
          <VideoGroup title="Moth survey" videos={MOTH_VIDEOS} />
          <p className="m-4 text-sm text-neutral-600">
            Habitat, plant, carabid, day-time pollinator and soil videos will be
            added here when they're ready.
          </p>
        </div>

        <p>
          If your question isn't covered by this page, please{' '}
          <a href="mailto:esurveyor@ceh.ac.uk">email us</a>.
        </p>
      </div>
    </Main>
  </Page>
);

export default Help;
