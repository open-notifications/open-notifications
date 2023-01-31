// ==========================================================================
//  Open Notifications
// ==========================================================================
//  Copyright (c) Open Notifications
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System.Text;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable MA0048 // File name must match type name

namespace OpenNotifications;

public partial class ApiErrorDto
{
    /// <inheritdoc />
    public override string ToString()
    {
        var sb = new StringBuilder();

        if (Code != default)
        {
            sb.Append(Code.ToString());
        }

        var message = Message?.Trim();

        if (!string.IsNullOrWhiteSpace(message))
        {
            sb.Append(", ");
            sb.Append(message);
        }

        if (sb.Length > 0)
        {
            sb.AppendLine();
        }

        if (Details != null)
        {
            foreach (var detail in Details)
            {
                sb.Append(" * ");
                detail.ToString(sb);
                sb.AppendLine();
            }
        }

        return sb.ToString();
    }
}

public partial class ErrorDto
{
    /// <inheritdoc />
    public override string ToString()
    {
        var sb = new StringBuilder();

        ToString(sb);

        return sb.ToString();
    }

    internal void ToString(StringBuilder sb)
    {
        if (Code != default)
        {
            sb.Append(Code.ToString());
        }

        var message = Message?.Trim();

        if (!string.IsNullOrWhiteSpace(message))
        {
            sb.Append(", ");
            sb.Append(message);
        }

        var field = Field?.Trim();

        if (!string.IsNullOrWhiteSpace(field))
        {
            sb.Append(", ");
            sb.Append("Field: ");
            sb.Append(field);
        }
    }
}

#pragma warning disable RECS0096 // Type parameter is never used
public partial class OpenNotificationsException<TResult>
#pragma warning restore RECS0096 // Type parameter is never used
{
    /// <inheritdoc />
    public override string ToString()
    {
        return $"{Result}\n{base.ToString()}";
    }
}
