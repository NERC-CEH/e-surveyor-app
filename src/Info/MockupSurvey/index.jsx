import React from 'react';
import { IonList } from '@ionic/react';
import { Page, Main, Header } from '@apps';
import './styles.scss';

const Component = () => {
  return (
    <Page id="mockup-survey">
      <Header title="Transects" />
      <Main id="mockup-survey" class="ion-padding">
        <IonList lines="full">
          <ion-item-divider mode="ios">
            <h4 slot="start">Transect #1</h4>
            <h4 slot="end" styles="font-weight: 200">
              26/05/2020
            </h4>
          </ion-item-divider>
          <ion-item-sliding class="survey-list-item md hydrated">
            <ion-item class="item md in-list ion-activatable ion-focusable item-label hydrated">
              <ion-avatar class="md hydrated">
                <img src="/images/route.svg" />
              </ion-avatar>
              <ion-label class="sc-ion-label-md-h sc-ion-label-md-s md hydrated">
                <div className="species-info">
                  <h3>Point #1</h3>
                  <div>
                    <span>
                      Species: <ion-badge class="md hydrated">1</ion-badge>
                    </span>
                    <span>
                      Seedmix: <ion-badge class="md hydrated">4/25</ion-badge>
                    </span>
                  </div>
                </div>
              </ion-label>
            </ion-item>
          </ion-item-sliding>
          <ion-item-sliding class="survey-list-item md hydrated">
            <ion-item class="item md in-list ion-activatable ion-focusable item-label hydrated">
              <ion-avatar class="md hydrated">
                <img src="/images/route.svg" />
              </ion-avatar>
              <ion-label class="sc-ion-label-md-h sc-ion-label-md-s md hydrated">
                <div className="species-info">
                  <h3>Point #2</h3>
                  <div>
                    <span>
                      Species: <ion-badge class="md hydrated">16</ion-badge>
                    </span>
                    <span>
                      Seedmix: <ion-badge class="md hydrated">5/25</ion-badge>
                    </span>
                  </div>
                </div>
              </ion-label>
            </ion-item>
          </ion-item-sliding>
          <ion-item-sliding class="survey-list-item md hydrated">
            <ion-item class="item md in-list ion-activatable ion-focusable item-label hydrated">
              <ion-avatar class="md hydrated">
                <img src="/images/route.svg" />
              </ion-avatar>
              <ion-label class="sc-ion-label-md-h sc-ion-label-md-s md hydrated">
                <div className="species-info">
                  <h3>Point #3</h3>
                  <div>
                    <span>
                      Species: <ion-badge class="md hydrated">11</ion-badge>
                    </span>
                    <span>
                      Seedmix: <ion-badge class="md hydrated">14/25</ion-badge>
                    </span>
                  </div>
                </div>
              </ion-label>
            </ion-item>
          </ion-item-sliding>
          <ion-item-sliding class="survey-list-item md hydrated">
            <ion-item class="item md in-list ion-activatable ion-focusable item-label hydrated">
              <ion-avatar class="md hydrated">
                <img src="/images/route.svg" />
              </ion-avatar>
              <ion-label class="sc-ion-label-md-h sc-ion-label-md-s md hydrated">
                <div className="species-info">
                  <h3>Point #4</h3>
                  <div>
                    <span>
                      Species: <ion-badge class="md hydrated">23</ion-badge>
                    </span>
                    <span>
                      Seedmix: <ion-badge class="md hydrated">13/25</ion-badge>
                    </span>
                  </div>
                </div>
              </ion-label>
            </ion-item>
          </ion-item-sliding>
          <ion-item-divider mode="ios">
            <h4 slot="start">Transect #2</h4>
            <h4 slot="end" styles="font-weight: 200">
              25/05/2020
            </h4>
          </ion-item-divider>
          <ion-item-sliding class="survey-list-item md hydrated">
            <ion-item class="item md in-list ion-activatable ion-focusable item-label hydrated">
              <ion-avatar class="md hydrated">
                <img src="/images/route.svg" />
              </ion-avatar>
              <ion-label class="sc-ion-label-md-h sc-ion-label-md-s md hydrated">
                <div className="species-info">
                  <h3>Point #1</h3>
                  <div>
                    <span>
                      Species: <ion-badge class="md hydrated">1</ion-badge>
                    </span>
                    <span>
                      Seedmix: <ion-badge class="md hydrated">4/25</ion-badge>
                    </span>
                  </div>
                </div>
              </ion-label>
            </ion-item>
          </ion-item-sliding>
        </IonList>
      </Main>
    </Page>
  );
};

Component.propTypes = {};

export default Component;
