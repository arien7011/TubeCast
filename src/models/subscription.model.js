/**
 * Defines the schema for a subscription in a MongoDB database using Mongoose.
 * This schema is used to represent a relationship between a subscriber and a channel.
 *
 * @typedef {import('mongoose').Schema} Schema
 * @typedef {import('mongoose').Document} Document
 * @typedef {import('mongoose').Model} Model
 *
 * @typedef {Object} SubscriptionDocument
 * @property {Schema.Types.ObjectId} subscriber - The ID of the subscriber.
 * @property {Schema.Types.ObjectId} channel - The ID of the channel.
 *
 * @typedef {Model<SubscriptionDocument>} SubscriptionModel
 *
 * @returns {SubscriptionModel} The Mongoose model for the subscription schema.
 */
const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId, //One who is subscribing the channel
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId,  // One to whom subscriber is subscribing
            ref: "User"
        }
    },
    { timestamps: true }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);