import {
  settingsOutline,
  arrowUndoOutline,
  personOutline,
  helpCircle,
  closeCircle,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Page, Main, Header, Collapse } from '@flumens';
import { IonList, IonItemDivider, IonIcon } from '@ionic/react';
import beeIcon from 'common/images/bee.svg';
import cameraButton from 'common/images/cameraButton.png';
import mapPicker from 'common/images/mapPicker.png';
import personTakingPhoto from 'common/images/personTakingPhoto.jpg';
import seedsIcon from 'common/images/seeds.svg';
import transectWShape from 'common/images/transectWShape.jpg';
import twoPeopleRecording from 'common/images/twoPeopleRecording.jpg';
import flowers from './flowers.jpg';
import insects from './insects.jpg';
import pollinatorsTable from './pollinators.png';
import './styles.scss';
import supportedGroupsTable from './supportedGroups.png';

export default () => (
  <Page id="help">
    <Header title="Help" />
    <Main>
      <IonList>
        <IonItemDivider>
          <T>User</T>
        </IonItemDivider>
        <div className="rounded-list">
          <Collapse title="Sign in/out or register">
            <p>
              <T>
                To login, open the main menu page click Login or Register
                buttons and follow the instructions.
              </T>
              <br />
              <br />
              <T>
                To logout, visit the main menu page and click the logout button.
              </T>
              .
              <br />
              <br />
              <b>
                <T>Note</T>:
              </b>{' '}
              <T>
                after registering a new account you must verify your email
                address by clicking on a verification link sent to your email
              </T>
              .
            </p>
          </Collapse>
        </div>

        <IonItemDivider>
          <T>Surveys</T>
        </IonItemDivider>
        <div className="rounded-list">
          <Collapse title="Sync. with the website">
            <p>
              <T>All your saved surveys will be shown on your account page.</T>
              <IonIcon icon={personOutline} />
              <br />
              <br />
              <T>
                By default a survey is in a &#39;draft&#39; mode which will not
                be sent to the database until the &#39;Finish&#39; button in the
                header is clicked. The application will try to submit your
                record once there is a good network connection.
              </T>
              <br />
              <br />
              <b>
                <T>Note</T>:
              </b>{' '}
              <T>
                you have to be signed in to your website account and have a
                network connection, for the records to be automatically
                synchronised in the background
              </T>
              .
              <br />
            </p>
          </Collapse>
          <Collapse title="Delete a record">
            <p>
              <T>
                To delete a record, swipe it left in your account page and click
                the delete button.
              </T>
            </p>
          </Collapse>
        </div>

        <IonItemDivider>
          <T>Record a habitat</T>
        </IonItemDivider>
        <div className="rounded-list">
          <Collapse title="How to complete a survey">
            <div>
              <p>
                Start by giving your survey a name (such as the name of the
                place you are surveying) and location. The app can pick up on
                your current location, but if you want to survey somewhere else,
                you can do this by clicking on the right arrow and using the map
                to choose your location.
              </p>
              <img src={mapPicker} />
              <p>
                Choose your seed supplier from the drop down menu, and then
                choose the name of your seed mix. This will allow the app to
                compare the plant species you sowed to the plants you see in the
                survey.
              </p>
              <p>You can now begin to add plants to your survey.</p>
              <img src={cameraButton} />
              <p>
                If you have identified the plants yourself, hold down the orange
                species button and write the name of your plant species into the
                text box.
              </p>
              <p>
                If you would like the AI to identify your plants, tap on the
                camera button and take a photo of the plant you would like to
                identify. If the AI isn't sure what your plant is, it will put
                an <IonIcon src={helpCircle} className="id-possible" /> or{' '}
                <IonIcon src={closeCircle} className="id-rejected" /> next to
                the photo and species name. You can tap to see images of
                different possible plant species, and choose which you think is
                correct by clicking "This is my plant".
              </p>
              <p>
                <a href="https://plantnet.org/en/how-why">Click here</a> to find
                out how to take an AI-friendly image.
              </p>
              <p>
                Keep going until you have a list of all of your plants, and then
                click the finish button in the top right corner to view your
                report.
              </p>
            </div>
          </Collapse>
          <Collapse title="What does my survey report mean?">
            <div>
              <p>
                <IonIcon src={seedsIcon} /> <b>Seed Mix</b> tells you how many
                of the plant species that you sowed (through your seed mix)
                appeared in your survey. Tap to find out which species are
                missing.
              </p>
              <p>
                <IonIcon src={beeIcon} /> <b>Insect</b> tells you how many
                insect species you are supporting. Tap for the full list of
                species.
              </p>
              <p>
                <b>Pollinators count</b>
              </p>
              <img src={pollinatorsTable} />
              <p>
                This section shows you how many pollinating species are
                supported by each of the plants in your habitat. More species is
                generally better, as it increases the long-term stability of
                your pollinator community, and in the short-term can increase
                the productivity of your crop. The green number tells you how
                many species are supported by a particular plant - tap the
                number to find out more.
              </p>
              <img src={insects} />

              <p>
                <b>Supported species groups</b>
              </p>
              <img src={supportedGroupsTable} />
              <p>
                Insects provide a lot of services within your habitat, such as
                pollination. It is good to support multiple species groups, as
                this helps to ensure a variety of services. In this section, you
                can see the number of species within each group that you are
                supporting. Tap on the group name to find out more about their
                benefits, and to see a full list of your supported species.
              </p>
            </div>
          </Collapse>
          <Collapse title="What do the symbols in the survey report mean?">
            <div>
              <p>
                <IonIcon src={seedsIcon} /> <b>Seed Mix</b> tells you how many
                of the plant species you sowed (through your seed mix) that
                appeared in your survey. Tap to find out which species are
                missing.
              </p>
              <p>
                <IonIcon src={beeIcon} /> <b>Insect</b> tells you how many
                insect species you are supporting. Tap for the full list of
                species.
              </p>
            </div>
          </Collapse>
          <Collapse title="How do I improve my score in the survey?">
            <div>
              <img src={flowers} />
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
          <Collapse title="Can I complete a survey without phone signal?">
            <div>
              <p>
                You can complete a survey without phone signal, however the
                plant identification feature will not work until you are back
                within range. If you know the plant species in your survey area,
                hold down the orange species button to type the names in. If you
                would like to use the AI plant identifier, you can still carry
                out the survey, but do not click "Finish" until you have phone
                signal and your plants have been identified.
              </p>
            </div>
          </Collapse>
        </div>

        <IonItemDivider>
          <T>Structured recording</T>
        </IonItemDivider>
        <div className="rounded-list">
          <Collapse title="Why should I do a transect?">
            <p>
              Because transects are carried out using an industry standard
              method, the results are easier to compare with other locations,
              "ideal habitats", or from one year to the next. This means that
              you can trust the transect feature to give an accurate
              representation of the quality of your habitat.
            </p>
          </Collapse>
          <Collapse title="How to set up a transect">
            <div>
              <p>
                Start by telling the app where you are doing the survey (your
                location). The app can pick up on your current location using
                your phone's GPS, but if you want to survey somewhere else, you
                can do this by clicking on the right arrow and using the map to
                choose your location.
              </p>
              <p>Then, select which type of survey you plan to do. </p>
              <p>
                This could be a survey with preexisting protocols, or a "custom"
                survey that allows you to choose how often you will stop (how
                many steps you will have), and what size your quadrat will be
                (the size of the area you will search for plants).
              </p>
              <p>
                If you are doing a pre-existing survey type, choose the habitat
                type that best reflects the area you will be surveying - this
                contains information on habitat quality for your transect
                results to be compared to.
              </p>
              <p>
                If you have sown a seed mix in the area, you can include that
                here too.
              </p>
              <p>
                Taking into account the number of steps you need to do (the
                number of times you will stop and identify plants), plan a route
                that covers all of the different features in your habitat.
              </p>
              <img src={transectWShape} />
              <p>
                Pick up your quadrat (or something that you can use to measure
                out the area you will search for plants in) and click next to
                carry out your transect!
              </p>
            </div>
          </Collapse>
          <Collapse title="How to complete a transect">
            <div>
              <img src={personTakingPhoto} />
              <p>
                Give your survey a name (such as the name of the place you are
                surveying).
              </p>
              <p>
                Place your quadrat down in the first spot (or measure out the
                area you will survey), and tap on the "Add quadrat" button.
              </p>
              <p>Take a photo of the entire quadrat.</p>
              <p>
                Then, hold down the orange camera button to start listing plants
                within the quadrat, or tap to take a photo for the AI to
                identify.
              </p>
              <p>
                Keep adding plants until you have listed all of the plants
                within the quadrat, then move on to your next location.
              </p>
              <p>
                Once you have completed all of your quadrats, tap finish to see
                your report.
              </p>
            </div>
          </Collapse>
          <Collapse title="What distance should I walk between quadrats in a transect?">
            <div>
              <img src={transectWShape} />
              <p>
                The distance you walk between each quadrat depends on the area
                of habitat you are surveying. You should try to walk an even
                distance between each quadrat, and plan your route so that you
                are stopping in areas with different features (such as a ridge,
                or a tree creating shade).
              </p>
            </div>
          </Collapse>
          <Collapse title="What does my transect report mean?">
            <div>
              <img src={twoPeopleRecording} />
              <p>
                The transect report compares your survey to a list of plant
                species that indicate good and bad quality habitat.
              </p>
              <p>
                Any species listed under "Positive" suggest that your habitat is
                good quality, and you are managing the land well.
              </p>
              <p>
                Species listed under "Negative" indicate a poorer quality
                habitat, which could mean that a land management change is
                needed.
              </p>
              <p>
                Each species has a fraction listed next to it, which tells you
                the proportion of quadrats that the species was found in. For
                example, 3/20 would mean that you did 20 quadrats, but only saw
                this species in 3 of them.
              </p>
              <p>
                As a guide, you can tell how common the species was by comparing
                to the following percentages, although this may change depending
                on the plant species or habitat type:
              </p>
              <p>20% of quadrats or fewer = A rare species</p>
              <p>21% to 40% of quadrats = An occasional species </p>
              <p>41% to 60% of quadrats = A frequent species</p>
              <p>60% of quadrats or more = a very frequent species</p>
            </div>
          </Collapse>
        </div>

        <IonItemDivider>
          <T>Identify a Species</T>
        </IonItemDivider>
        <div className="rounded-list">
          <Collapse title="Why is the AI not certain what my species is?">
            <p>
              There are some common reasons why the AI might be uncertain.
              Perhaps the plant is small within your image, blurry, or one of
              multiple species in the image. In some cases, features of the
              plant needed for identification are missing from teh image.
              Alternatively if the species is very rare, the AI may not have
              been trained to identify it. Rather than give an incorrect answer,
              the AI will let you know how confident it is so that you can
              decide whether to accept its suggestion.
            </p>
          </Collapse>
          <Collapse
            title="What should I do if I think that the AI has picked the
              wrong species?"
          >
            <p>
              If you think the AI has picked the wrong species, tap on the
              identification and you will be shown a list of similar species. If
              you can find a better fit for your image there, tap "This is my
              plant" to change the identification. If you know what the species
              is before you take your photo, hold down the camera button to
              access a text box where you can write in your species' name.
            </p>
          </Collapse>
          <Collapse title="5 tips for an AI-friendly image">
            <ol>
              <li>
                Make sure that one part of your species (such as a flower or a
                leaf) is in the centre of the image.
              </li>
              <li>
                Try to avoid a busy background, particularly one with a lot of
                other species in it.
              </li>
              <li>
                Focus the image by tapping on the part of your species you want
                to take a photo of, and then slowly zoom in, refocusing as you
                go.
              </li>
              <li>
                Check that nothing is between the species and the camera, such
                as an insect or your finger.
              </li>
              <li>
                If the AI is uncertain about the species you can add more photos
                from different angles or of different parts of your species to
                help improve identification.
              </li>
            </ol>
          </Collapse>
        </div>

        <IonItemDivider>
          <T>Other</T>
        </IonItemDivider>
        <div className="rounded-list">
          <Collapse title="Reset the application">
            <p>
              <T>Go to the application settings page</T>{' '}
              <IonIcon icon={settingsOutline} /> <T>and click on the Reset</T>{' '}
              <IonIcon icon={arrowUndoOutline} />
              <T>button</T>.
            </p>
          </Collapse>
        </div>
      </IonList>

      <p>
        If your question isn't covered by this page, please{' '}
        <a href="mailto:esurveyor@ceh.ac.uk"> email us</a>.
      </p>
    </Main>
  </Page>
);
