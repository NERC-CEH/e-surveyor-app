import React from 'react';
import { IonList, IonItemDivider, IonIcon } from '@ionic/react';
import { Page, Main, Header, Collapse } from '@flumens';
import { Trans as T } from 'react-i18next';
import {
  settingsOutline,
  arrowUndoOutline,
  personOutline,
} from 'ionicons/icons';
import './styles.scss';

export default () => (
  <Page id="help">
    <Header title="Help" />
    <Main class="ion-padding">
      <IonList lines="none">
        <IonItemDivider>
          <T>Surveys</T>
        </IonItemDivider>
        <div className="rounded">
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
          <T>User</T>
        </IonItemDivider>
        <div className="rounded">
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
          <T>Other</T>
        </IonItemDivider>
        <div className="rounded">
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
